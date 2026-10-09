const asyncHandler = require("express-async-handler");
const Property  = require("../models/Property");
const Lead      = require("../models/Lead");
const Favorite  = require("../models/Favorite");
const View      = require("../models/View");
const { uploadFiles } = require("../utils/cloudinary");

// ── Helpers ──────────────────────────────────────────────────────────────────

// Builds GeoJSON Point from lat/lng — returns undefined when coords are absent
const buildLocation = (lat, lng) => {
  const la = Number(lat);
  const lo = Number(lng);
  if (!lat || !lng || isNaN(la) || isNaN(lo)) return undefined;
  return { type: "Point", coordinates: [lo, la] }; // GeoJSON is [lng, lat]
};

// ─── @route  GET /api/properties ─────────────────────────────────────────────
const getProperties = asyncHandler(async (req, res) => {
  const {
    city, propertyType, listingType,
    minPrice, maxPrice, minBedrooms, minArea,
    search, isFeatured,
    page = 1, limit = 12,
  } = req.query;

  const query = { status: "approved" };

  if (city)         query.city = { $regex: city, $options: "i" };
  if (propertyType) query.propertyType = propertyType;
  if (listingType)  query.listingType  = listingType;
  if (minBedrooms)  query.bedrooms     = { $gte: Number(minBedrooms) };
  if (minArea)      query.area         = { $gte: Number(minArea) };
  if (isFeatured === "true") query.isFeatured = true;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) query.$text = { $search: search };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Property.countDocuments(query);

  const properties = await Property.find(query)
    .populate("owner", "name email phone avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    properties,
  });
});

// ─── @route  GET /api/properties/nearby ──────────────────────────────────────
// ?lng=&lat=&radius=5000 (metres)
const getNearbyProperties = asyncHandler(async (req, res) => {
  const { lng, lat, radius = 5000 } = req.query;

  if (!lng || !lat) {
    res.status(400);
    throw new Error("lng and lat query params are required");
  }

  const properties = await Property.find({
    status: "approved",
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius),
      },
    },
  })
    .populate("owner", "name email phone avatar")
    .limit(20);

  res.json({ success: true, properties });
});

// ─── @route  GET /api/properties/:id ─────────────────────────────────────────
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "owner", "name email phone avatar"
  );

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Async view tracking — fire-and-forget, never blocks response
  const userId      = req.user?._id ?? null;
  const fingerprint = req.headers["x-fingerprint"] || req.ip || "";

  View.create({ property: property._id, user: userId, fingerprint }).then(() =>
    Property.findByIdAndUpdate(property._id, { $inc: { views: 1 } })
  ).catch(() => {}); // silently ignore tracking errors

  res.json({ success: true, property });
});

// ─── @route  POST /api/properties ────────────────────────────────────────────
const createProperty = asyncHandler(async (req, res) => {
  const {
    title, description, price, propertyType, listingType,
    bedrooms, bathrooms, area, city, address, contactPhone,
    latitude, longitude,
    dailyPrice, indoorOutdoor, parkingAvailable,
    amenities,
  } = req.body;

  if (!title || !description || !price || !propertyType || !listingType || !area || !city || !address || !contactPhone) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  const images = req.files?.length ? await uploadFiles(req.files) : [];

  const lat = latitude  ? Number(latitude)  : null;
  const lng = longitude ? Number(longitude) : null;

  const property = await Property.create({
    title, description, propertyType, listingType,
    city, address, contactPhone,
    price:    Number(price),
    area:     Number(area),
    bedrooms: bedrooms  ? Number(bedrooms)  : 0,
    bathrooms:bathrooms ? Number(bathrooms) : 0,
    latitude: lat,
    longitude:lng,
    location: buildLocation(lat, lng),
    dailyPrice:       dailyPrice       ? Number(dailyPrice) : null,
    indoorOutdoor:    indoorOutdoor    || null,
    parkingAvailable: parkingAvailable === "true" || parkingAvailable === true,
    amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(",").map(a => a.trim())) : [],
    images,
    owner:  req.user._id,
    status: req.user.role === "admin" ? "approved" : "pending",
  });

  res.status(201).json({ success: true, property });
});

// ─── @route  PUT /api/properties/:id ─────────────────────────────────────────
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this property");
  }

  const scalar = [
    "title", "description", "price", "propertyType", "listingType",
    "bedrooms", "bathrooms", "area", "city", "address", "contactPhone",
    "latitude", "longitude", "dailyPrice", "indoorOutdoor", "parkingAvailable",
  ];
  scalar.forEach(f => { if (req.body[f] !== undefined) property[f] = req.body[f]; });

  // Keep GeoJSON location in sync with flat lat/lng
  const lat = property.latitude  ? Number(property.latitude)  : null;
  const lng = property.longitude ? Number(property.longitude) : null;
  property.location = buildLocation(lat, lng);

  if (req.body.amenities !== undefined) {
    property.amenities = Array.isArray(req.body.amenities)
      ? req.body.amenities
      : req.body.amenities.split(",").map(a => a.trim());
  }

  if (req.files?.length) {
    const newImages = await uploadFiles(req.files);
    property.images = [...property.images, ...newImages];
  }

  if (req.user.role !== "admin") property.status = "pending";

  const updated = await property.save();
  res.json({ success: true, property: updated });
});

// ─── @route  DELETE /api/properties/:id ──────────────────────────────────────
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this property");
  }

  await property.deleteOne();
  res.json({ success: true, message: "Property deleted successfully" });
});

// ─── @route  GET /api/properties/my ──────────────────────────────────────────
const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, properties });
});

// ─── @route  POST /api/properties/:id/lead ───────────────────────────────────
const submitLead = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const { senderName, senderPhone, senderEmail, message } = req.body;

  if (!senderName || !senderPhone) {
    res.status(400);
    throw new Error("Name and phone are required");
  }

  const lead = await Lead.create({
    property: property._id,
    broker:   property.owner,
    buyer:    req.user?._id ?? null,
    senderName,
    senderPhone,
    senderEmail: senderEmail || "",
    message:     message     || "",
  });

  res.status(201).json({ success: true, message: "Enquiry sent successfully", lead });
});

// ─── @route  POST /api/properties/:id/favorite ───────────────────────────────
// Toggle save/unsave for logged-in buyers
const toggleFavorite = asyncHandler(async (req, res) => {
  const existing = await Favorite.findOne({ user: req.user._id, property: req.params.id });

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, saved: false });
  }

  await Favorite.create({ user: req.user._id, property: req.params.id });
  res.status(201).json({ success: true, saved: true });
});

// ─── @route  GET /api/properties/favorites ───────────────────────────────────
const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .populate({ path: "property", populate: { path: "owner", select: "name email phone avatar" } })
    .sort({ createdAt: -1 });

  const properties = favorites.map(f => f.property).filter(Boolean);
  res.json({ success: true, properties });
});

module.exports = {
  getProperties,
  getNearbyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  submitLead,
  toggleFavorite,
  getFavorites,
};
