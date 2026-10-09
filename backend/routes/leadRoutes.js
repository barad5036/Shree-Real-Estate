const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Lead = require("../models/Lead");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/leads/my — broker sees leads for their own properties
router.get(
  "/my",
  protect,
  authorize("broker", "admin"),
  asyncHandler(async (req, res) => {
    const leads = await Lead.find({ broker: req.user._id })
      .populate("property", "title city images")
      .sort({ createdAt: -1 });
    res.json({ success: true, leads });
  })
);

// PUT /api/leads/:id/status — broker updates lead status
router.put(
  "/:id/status",
  protect,
  authorize("broker", "admin"),
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!["new", "contacted", "closed"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status");
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }

    // Brokers can only update their own leads
    if (
      req.user.role !== "admin" &&
      lead.broker.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized");
    }

    lead.status = status;
    await lead.save();
    res.json({ success: true, lead });
  })
);

module.exports = router;
