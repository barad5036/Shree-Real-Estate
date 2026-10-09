const mongoose = require("mongoose");

const viewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    // null for anonymous visitors
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Coarse fingerprint for dedup without storing PII
    fingerprint: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Fast analytics aggregation per property
viewSchema.index({ property: 1, createdAt: -1 });

// Auto-delete view records older than 90 days to keep collection lean
viewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

module.exports = mongoose.model("View", viewSchema);
