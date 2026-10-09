const asyncHandler = require("express-async-handler");
const User     = require("../models/User");
const Property = require("../models/Property");
const Lead     = require("../models/Lead");
const Review   = require("../models/Review");

const escapeRegex = (v = "") => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ── GET /api/agents ───────────────────────────────────────────────────────────
const getAgents = asyncHandler(async (req, res) => {
  const { search, city, minExp, maxExp, minRating, page = 1, limit = 12 } = req.query;

  const safePage  = Math.max(Number(page)  || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip      = (safePage - 1) * safeLimit;

  const query = { role: "broker", isBlocked: { $ne: true } };

  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: rx }, { companyName: rx }, { location: rx }];
  }
  if (city)      query.$or = [{ location: { $regex: escapeRegex(city), $options: "i" } }, { serviceAreas: { $in: [new RegExp(escapeRegex(city), "i")] } }];
  if (minExp)    query.experience = { ...query.experience, $gte: Number(minExp) };
  if (maxExp)    query.experience = { ...query.experience, $lte: Number(maxExp) };
  if (minRating) query.rating     = { $gte: Number(minRating) };

  const [agents, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    User.countDocuments(query),
  ]);

  const agentIds = agents.map((a) => a._id);
  const listingCounts = await Property.aggregate([
    { $match: { owner: { $in: agentIds }, status: "approved" } },
    { $group: { _id: "$owner", count: { $sum: 1 } } },
  ]);
  const countMap = Object.fromEntries(listingCounts.map((l) => [l._id.toString(), l.count]));

  const result = agents.map((a) => ({
    ...a.toObject(),
    totalListings: countMap[a._id.toString()] || 0,
  }));

  res.json({ success: true, total, page: safePage, pages: Math.ceil(total / safeLimit) || 1, agents: result });
});

// ── GET /api/agents/:id ───────────────────────────────────────────────────────
const getAgentProfile = asyncHandler(async (req, res) => {
  const agent = await User.findOne({ _id: req.params.id, role: "broker" }).select("-password");
  if (!agent) { res.status(404); throw new Error("Agent not found"); }

  const properties = await Property.find({ owner: req.params.id, status: "approved" }).sort({ createdAt: -1 });

  res.json({ success: true, agent, properties, totalListings: properties.length });
});

// ── GET /api/agents/:id/stats ─────────────────────────────────────────────────
const getAgentStats = asyncHandler(async (req, res) => {
  const agent = await User.findOne({ _id: req.params.id, role: "broker" }).select("_id");
  if (!agent) { res.status(404); throw new Error("Agent not found"); }

  const [listings, leads, approved, pending] = await Promise.all([
    Property.countDocuments({ owner: req.params.id }),
    Lead.countDocuments({ broker: req.params.id }),
    Property.countDocuments({ owner: req.params.id, status: "approved" }),
    Property.countDocuments({ owner: req.params.id, status: "pending" }),
  ]);

  res.json({ success: true, listings, leads, approved, pending });
});

// ── PUT /api/agents/profile ───────────────────────────────────────────────────
const updateBrokerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user || user.role !== "broker") { res.status(403); throw new Error("Only brokers can update broker profile"); }

  const allowed = ["companyName", "experience", "specialization", "serviceAreas", "languages", "reraId", "bio", "officeAddress", "location"];
  allowed.forEach((key) => { if (req.body[key] !== undefined) user[key] = req.body[key]; });

  await user.save();
  const updated = user.toObject();
  delete updated.password;
  res.json({ success: true, message: "Profile updated", user: updated });
});

// ── GET /api/agents/:id/reviews ───────────────────────────────────────────────
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ broker: req.params.id })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

// ── POST /api/agents/:id/reviews ──────────────────────────────────────────────
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) { res.status(400); throw new Error("Rating must be between 1 and 5"); }

  const broker = await User.findOne({ _id: req.params.id, role: "broker" });
  if (!broker) { res.status(404); throw new Error("Broker not found"); }

  if (broker._id.toString() === req.user._id.toString()) {
    res.status(400); throw new Error("You cannot review yourself");
  }

  // Upsert — one review per user per broker
  const existing = await Review.findOne({ broker: req.params.id, user: req.user._id });
  if (existing) {
    existing.rating  = rating;
    existing.comment = comment || "";
    await existing.save();
  } else {
    await Review.create({ broker: req.params.id, user: req.user._id, rating, comment: comment || "" });
  }

  // Recalculate broker rating
  const agg = await Review.aggregate([
    { $match: { broker: broker._id } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avg = 0, count = 0 } = agg[0] || {};
  broker.rating      = Math.round(avg * 10) / 10;
  broker.totalReviews = count;
  await broker.save();

  res.json({ success: true, message: "Review submitted", rating: broker.rating, totalReviews: broker.totalReviews });
});

// ── PUT /api/agents/:id/verify  (admin only) ──────────────────────────────────
const verifyBroker = asyncHandler(async (req, res) => {
  const broker = await User.findOne({ _id: req.params.id, role: "broker" });
  if (!broker) { res.status(404); throw new Error("Broker not found"); }
  broker.isVerified = !broker.isVerified;
  await broker.save();
  res.json({ success: true, isVerified: broker.isVerified, message: `Broker ${broker.isVerified ? "verified" : "unverified"}` });
});

// ── PUT /api/agents/:id/block  (admin only) ───────────────────────────────────
const toggleBlockBroker = asyncHandler(async (req, res) => {
  const broker = await User.findOne({ _id: req.params.id, role: "broker" });
  if (!broker) { res.status(404); throw new Error("Broker not found"); }
  broker.isBlocked = !broker.isBlocked;
  await broker.save();
  res.json({ success: true, isBlocked: broker.isBlocked, message: `Broker ${broker.isBlocked ? "blocked" : "unblocked"}` });
});

module.exports = { getAgents, getAgentProfile, getAgentStats, updateBrokerProfile, getReviews, addReview, verifyBroker, toggleBlockBroker };
