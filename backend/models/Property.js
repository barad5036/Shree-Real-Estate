const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },
    propertyType: {
      type: String,
      required: [true, "Property type is required"],
      enum: ["House", "Apartment", "Land / Plot", "Shop / Commercial", "Warehouse", "Shooting Location"],
      index: true,
    },
    listingType: {
      type: String,
      required: [true, "Listing type is required"],
      enum: ["sale", "rent"],
      index: true,
    },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: {
      type: Number,
      required: [true, "Area is required"],
      min: [1, "Area must be at least 1 sqft"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      trim: true,
    },
    images: { type: [String], default: [] },

    // Flat lat/lng kept for backward compatibility
    latitude:  { type: Number, default: null },
    longitude: { type: Number, default: null },

    // GeoJSON point — auto-populated from latitude/longitude
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: undefined,
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },

    // Analytics counter (fast increment via $inc)
    views: { type: Number, default: 0 },

    amenities: { type: [String], default: [] },

    // Shooting Location extras
    dailyPrice:      { type: Number, default: null },
    indoorOutdoor:   { type: String, enum: ["Indoor", "Outdoor", "Both", "", null], default: null },
    parkingAvailable:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

// ── Indexes ──────────────────────────────────────────────────────────────────

// Full-text search across key fields
propertySchema.index({ title: "text", description: "text", city: "text", address: "text" });

// Most common filter combination
propertySchema.index({ status: 1, city: 1, price: 1 });
propertySchema.index({ status: 1, listingType: 1, propertyType: 1 });
propertySchema.index({ status: 1, isFeatured: 1, createdAt: -1 });
propertySchema.index({ owner: 1, status: 1 });
propertySchema.index({ city: 1, createdAt: -1 });
propertySchema.index({ owner: 1, createdAt: -1 });

// Geo queries — requires coordinates to be set
propertySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Property", propertySchema);
