const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Linked buyer account (optional — set when sender is logged in)
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    // Kept for backward compat — guests submit without an account
    senderName:  { type: String, required: [true, "Sender name is required"], trim: true },
    senderPhone: { type: String, required: [true, "Sender phone is required"], trim: true },
    senderEmail: { type: String, trim: true, default: "" },
    message:     { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

// Fast broker inbox query: broker + status + newest first
leadSchema.index({ broker: 1, status: 1, createdAt: -1 });
// Fast property-level lead lookup
leadSchema.index({ property: 1, createdAt: -1 });
// Admin analytics filters
leadSchema.index({ buyer: 1, createdAt: -1 });
leadSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Lead", leadSchema);
