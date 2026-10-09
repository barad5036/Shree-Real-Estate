const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// ─── Helpers ────────────────────────────────────────────────────────────────

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:           user._id,
      name:          user.name,
      email:         user.email,
      role:          user.role,
      phone:         user.phone,
      avatar:        user.avatar,
      isVerified:    user.isVerified,
      isBlocked:     user.isBlocked,
      companyName:   user.companyName,
      experience:    user.experience,
      specialization:user.specialization,
      serviceAreas:  user.serviceAreas,
      languages:     user.languages,
      reraId:        user.reraId,
      bio:           user.bio,
      officeAddress: user.officeAddress,
      location:      user.location,
      rating:        user.rating,
      totalReviews:  user.totalReviews,
      createdAt:     user.createdAt,
    },
  });
};

// ─── @route  POST /api/auth/register ────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Prevent self-assigning admin role
  const assignedRole = role === "admin" ? "buyer" : role || "buyer";

  const user = await User.create({ name, email, password, role: assignedRole, phone });
  sendTokenResponse(user, 201, res);
});

// ─── @route  POST /api/auth/login ───────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendTokenResponse(user, 200, res);
});

// ─── @route  GET /api/auth/profile ──────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
});

// ─── @route  PUT /api/auth/profile ──────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;

  if (req.body.password) {
    user.password = req.body.password; // pre-save hook will hash it
  }

  const updated = await user.save();
  sendTokenResponse(updated, 200, res);
});

module.exports = { register, login, getProfile, updateProfile };
