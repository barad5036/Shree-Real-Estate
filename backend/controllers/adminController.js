const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Property = require("../models/Property");
const User = require("../models/User");
const Lead = require("../models/Lead");
const Favorite = require("../models/Favorite");
const View = require("../models/View");

const { Types } = mongoose;

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildDateRange = (from, to) => {
  const range = {};

  if (from) {
    const start = new Date(from);
    if (!Number.isNaN(start.getTime())) {
      range.$gte = start;
    }
  }

  if (to) {
    const end = new Date(to);
    if (!Number.isNaN(end.getTime())) {
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }
  }

  return Object.keys(range).length ? range : null;
};

const buildPagination = (page = 1, limit = 20) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

const toObjectId = (value) => (Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : null);

const getStats = asyncHandler(async (req, res) => {
  const [summary] = await Property.aggregate([
    {
      $facet: {
        propertyTotals: [
          {
            $group: {
              _id: null,
              totalProperties: { $sum: 1 },
              pendingProperties: {
                $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
              },
              approvedProperties: {
                $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
              },
              rejectedProperties: {
                $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
              },
            },
          },
        ],
        propertyStatusBreakdown: [
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        propertyTypeBreakdown: [
          { $group: { _id: "$propertyType", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        topCities: [
          { $group: { _id: "$city", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
        ],
        monthlyListings: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          { $limit: 12 },
        ],
      },
    },
  ]);

  const [userSummary] = await User.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalUsers: { $sum: 1 },
              totalBrokers: {
                $sum: { $cond: [{ $eq: ["$role", "broker"] }, 1, 0] },
              },
              totalBuyers: {
                $sum: { $cond: [{ $eq: ["$role", "buyer"] }, 1, 0] },
              },
              totalAdmins: {
                $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
              },
            },
          },
        ],
        roleBreakdown: [
          { $group: { _id: "$role", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        monthlyUsers: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          { $limit: 12 },
        ],
      },
    },
  ]);

  const [leadSummary] = await Lead.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalLeads: { $sum: 1 },
              newLeads: {
                $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
              },
              contactedLeads: {
                $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
              },
              closedLeads: {
                $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
              },
            },
          },
        ],
        monthlyLeads: [
          {
            $group: {
              _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
          { $limit: 12 },
        ],
      },
    },
  ]);

  const propertyTotals = summary?.propertyTotals?.[0] || {};
  const userTotals = userSummary?.totals?.[0] || {};
  const leadTotals = leadSummary?.totals?.[0] || {};

  res.json({
    success: true,
    stats: {
      totalUsers: userTotals.totalUsers || 0,
      totalBrokers: userTotals.totalBrokers || 0,
      totalBuyers: userTotals.totalBuyers || 0,
      totalAdmins: userTotals.totalAdmins || 0,
      totalProperties: propertyTotals.totalProperties || 0,
      pendingProperties: propertyTotals.pendingProperties || 0,
      approvedProperties: propertyTotals.approvedProperties || 0,
      rejectedProperties: propertyTotals.rejectedProperties || 0,
      totalLeads: leadTotals.totalLeads || 0,
      newLeads: leadTotals.newLeads || 0,
      contactedLeads: leadTotals.contactedLeads || 0,
      closedLeads: leadTotals.closedLeads || 0,
      charts: {
        propertyStatusBreakdown: summary?.propertyStatusBreakdown || [],
        propertyTypeBreakdown: summary?.propertyTypeBreakdown || [],
        roleBreakdown: userSummary?.roleBreakdown || [],
        topCities: summary?.topCities || [],
        monthlyListings: summary?.monthlyListings || [],
        monthlyUsers: userSummary?.monthlyUsers || [],
        monthlyLeads: leadSummary?.monthlyLeads || [],
      },
    },
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
  const { skip, page: currentPage, limit: pageSize } = buildPagination(page, limit);

  const query = {};

  if (role && ["buyer", "broker", "admin"].includes(role)) {
    query.role = role;
  }

  if (search) {
    const matcher = new RegExp(escapeRegex(search), "i");
    query.$or = [
      { name: matcher },
      { email: matcher },
      { phone: matcher },
    ];
  }

  const createdAt = buildDateRange(dateFrom, dateTo);
  if (createdAt) {
    query.createdAt = createdAt;
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    total,
    page: currentPage,
    pages: Math.ceil(total / pageSize) || 1,
    users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const [propertyCount, leadCount, recentListings, recentLeads] = await Promise.all([
    Property.countDocuments({ owner: user._id }),
    Lead.countDocuments({
      $or: [{ buyer: user._id }, { broker: user._id }],
    }),
    Property.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title city status price createdAt"),
    Lead.find({
      $or: [{ buyer: user._id }, { broker: user._id }],
    })
      .populate("property", "title city")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({
    success: true,
    user,
    summary: {
      propertyCount,
      leadCount,
    },
    recentListings,
    recentLeads,
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["buyer", "broker", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: "User role updated successfully",
    user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.user._id.toString() === user._id.toString()) {
    res.status(400);
    throw new Error("Admin cannot delete their own account");
  }

  const ownedProperties = await Property.find({ owner: user._id }).select("_id");
  const propertyIds = ownedProperties.map((property) => property._id);

  await Promise.all([
    Property.deleteMany({ owner: user._id }),
    Lead.deleteMany({
      $or: [
        { broker: user._id },
        { buyer: user._id },
        propertyIds.length ? { property: { $in: propertyIds } } : null,
      ].filter(Boolean),
    }),
    Favorite.deleteMany({
      $or: [
        { user: user._id },
        propertyIds.length ? { property: { $in: propertyIds } } : null,
      ].filter(Boolean),
    }),
    View.deleteMany({
      $or: [
        { user: user._id },
        propertyIds.length ? { property: { $in: propertyIds } } : null,
      ].filter(Boolean),
    }),
    user.deleteOne(),
  ]);

  res.json({ success: true, message: "User and related data deleted successfully" });
});

const getAllProperties = asyncHandler(async (req, res) => {
  const {
    status,
    city,
    brokerId,
    propertyType,
    listingType,
    search,
    dateFrom,
    dateTo,
    page = 1,
    limit = 20,
  } = req.query;

  const { skip, page: currentPage, limit: pageSize } = buildPagination(page, limit);
  const query = {};

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query.status = status;
  }

  if (city) {
    query.city = { $regex: escapeRegex(city), $options: "i" };
  }

  if (propertyType) {
    query.propertyType = propertyType;
  }

  if (listingType) {
    query.listingType = listingType;
  }

  if (brokerId && Types.ObjectId.isValid(brokerId)) {
    query.owner = brokerId;
  }

  if (search) {
    query.$or = [
      { title: { $regex: escapeRegex(search), $options: "i" } },
      { city: { $regex: escapeRegex(search), $options: "i" } },
      { address: { $regex: escapeRegex(search), $options: "i" } },
    ];
  }

  const createdAt = buildDateRange(dateFrom, dateTo);
  if (createdAt) {
    query.createdAt = createdAt;
  }

  const [properties, total] = await Promise.all([
    Property.find(query)
      .populate("owner", "name email phone role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    Property.countDocuments(query),
  ]);

  res.json({
    success: true,
    total,
    page: currentPage,
    pages: Math.ceil(total / pageSize) || 1,
    properties,
  });
});

const updatePropertyStatus = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate("owner", "name email phone");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  property.status = req.statusToApply;
  await property.save();

  res.json({
    success: true,
    message: `Property ${req.statusToApply} successfully`,
    property,
  });
});

const approveProperty = (req, res, next) => {
  req.statusToApply = "approved";
  return updatePropertyStatus(req, res, next);
};

const rejectProperty = (req, res, next) => {
  req.statusToApply = "rejected";
  return updatePropertyStatus(req, res, next);
};

const adminDeleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  await Promise.all([
    Lead.deleteMany({ property: property._id }),
    Favorite.deleteMany({ property: property._id }),
    View.deleteMany({ property: property._id }),
    property.deleteOne(),
  ]);

  res.json({ success: true, message: "Property deleted successfully" });
});

const getAllLeads = asyncHandler(async (req, res) => {
  const {
    search,
    dateFrom,
    dateTo,
    brokerId,
    propertyId,
    city,
    page = 1,
    limit = 20,
  } = req.query;

  const { skip, page: currentPage, limit: pageSize } = buildPagination(page, limit);
  const matchStage = {};
  const createdAt = buildDateRange(dateFrom, dateTo);

  if (createdAt) {
    matchStage.createdAt = createdAt;
  }

  if (brokerId && Types.ObjectId.isValid(brokerId)) {
    matchStage.broker = toObjectId(brokerId);
  }

  if (propertyId && Types.ObjectId.isValid(propertyId)) {
    matchStage.property = toObjectId(propertyId);
  }

  const searchRegex = search ? new RegExp(escapeRegex(search), "i") : null;

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyerDetails",
      },
    },
    { $unwind: { path: "$buyerDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "properties",
        localField: "property",
        foreignField: "_id",
        as: "propertyDetails",
      },
    },
    { $unwind: { path: "$propertyDetails", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "propertyDetails.owner",
        foreignField: "_id",
        as: "brokerDetails",
      },
    },
    { $unwind: { path: "$brokerDetails", preserveNullAndEmptyArrays: true } },
  ];

  if (city) {
    pipeline.push({
      $match: {
        "propertyDetails.city": { $regex: escapeRegex(city), $options: "i" },
      },
    });
  }

  if (searchRegex) {
    pipeline.push({
      $match: {
        $or: [
          { senderName: searchRegex },
          { senderEmail: searchRegex },
          { message: searchRegex },
          { "buyerDetails.name": searchRegex },
          { "brokerDetails.name": searchRegex },
          { "propertyDetails.title": searchRegex },
        ],
      },
    });
  }

  pipeline.push(
    {
      $project: {
        _id: 1,
        message: 1,
        status: 1,
        createdAt: 1,
        senderName: 1,
        senderPhone: 1,
        senderEmail: 1,
        buyerId: "$buyerDetails._id",
        buyerName: { $ifNull: ["$buyerDetails.name", "$senderName"] },
        buyerEmail: { $ifNull: ["$buyerDetails.email", "$senderEmail"] },
        brokerId: "$brokerDetails._id",
        brokerName: "$brokerDetails.name",
        brokerEmail: "$brokerDetails.email",
        propertyId: "$propertyDetails._id",
        propertyTitle: "$propertyDetails.title",
        propertyCity: "$propertyDetails.city",
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: pageSize }],
        total: [{ $count: "count" }],
      },
    }
  );

  const [result] = await Lead.aggregate(pipeline);
  const total = result?.total?.[0]?.count || 0;

  res.json({
    success: true,
    total,
    page: currentPage,
    pages: Math.ceil(total / pageSize) || 1,
    leads: result?.data || [],
  });
});

const getBrokerPerformance = asyncHandler(async (req, res) => {
  const { search, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
  const { skip, page: currentPage, limit: pageSize } = buildPagination(page, limit);

  const brokerMatch = { role: "broker" };
  const createdAt = buildDateRange(dateFrom, dateTo);

  if (createdAt) {
    brokerMatch.createdAt = createdAt;
  }

  if (search) {
    const matcher = new RegExp(escapeRegex(search), "i");
    brokerMatch.$or = [{ name: matcher }, { email: matcher }, { phone: matcher }];
  }

  const [brokers, total] = await Promise.all([
    User.find(brokerMatch)
      .select("name email phone avatar isVerified isBlocked createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize),
    User.countDocuments(brokerMatch),
  ]);

  const brokerIds = brokers.map((broker) => broker._id);

  const [listingStats, leadStats] = await Promise.all([
    Property.aggregate([
      { $match: { owner: { $in: brokerIds } } },
      {
        $group: {
          _id: "$owner",
          totalListings: { $sum: 1 },
          approvedListings: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          pendingListings: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          rejectedListings: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          totalViews: { $sum: "$views" },
        },
      },
    ]),
    Lead.aggregate([
      { $match: { broker: { $in: brokerIds } } },
      {
        $group: {
          _id: "$broker",
          totalLeads: { $sum: 1 },
          newLeads: {
            $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
          },
          contactedLeads: {
            $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] },
          },
          closedLeads: {
            $sum: { $cond: [{ $eq: ["$status", "closed"] }, 1, 0] },
          },
        },
      },
    ]),
  ]);

  const listingMap = Object.fromEntries(
    listingStats.map((stat) => [stat._id.toString(), stat])
  );
  const leadMap = Object.fromEntries(
    leadStats.map((stat) => [stat._id.toString(), stat])
  );

  const performance = brokers.map((broker) => {
    const listing = listingMap[broker._id.toString()] || {};
    const lead = leadMap[broker._id.toString()] || {};

    return {
      brokerId:        broker._id,
      brokerName:      broker.name,
      brokerEmail:     broker.email,
      brokerPhone:     broker.phone,
      isVerified:      broker.isVerified,
      isBlocked:       broker.isBlocked,
      joinedAt:        broker.createdAt,
      totalListings:   listing.totalListings   || 0,
      approvedListings:listing.approvedListings || 0,
      pendingListings: listing.pendingListings  || 0,
      rejectedListings:listing.rejectedListings || 0,
      totalViews:      listing.totalViews       || 0,
      totalLeads:      lead.totalLeads          || 0,
      newLeads:        lead.newLeads            || 0,
      contactedLeads:  lead.contactedLeads      || 0,
      closedLeads:     lead.closedLeads         || 0,
    };
  });

  res.json({
    success: true,
    total,
    page: currentPage,
    pages: Math.ceil(total / pageSize) || 1,
    brokers: performance,
  });
});

module.exports = {
  getStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getAllProperties,
  approveProperty,
  rejectProperty,
  adminDeleteProperty,
  getAllLeads,
  getBrokerPerformance,
};
