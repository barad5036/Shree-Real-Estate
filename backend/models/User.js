const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["buyer", "broker", "admin"],
      default: "buyer",
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    isVerified:     { type: Boolean, default: false },
    isBlocked:      { type: Boolean, default: false },

    // ── Broker-specific top-level fields ─────────────────────────────────
    companyName:    { type: String, default: "" },
    experience:     { type: Number, default: 0 },
    specialization: { type: [String], default: [] },
    serviceAreas:   { type: [String], default: [] },
    languages:      { type: [String], default: [] },
    reraId:         { type: String, default: "" },
    bio:            { type: String, default: "" },
    officeAddress:  { type: String, default: "" },
    location:       { type: String, default: "" },

    rating:         { type: Number, default: 0 },
    totalReviews:   { type: Number, default: 0 },
    totalListings:  { type: Number, default: 0 },
    propertiesSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1, createdAt: -1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model("User", userSchema);
