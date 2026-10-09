const express = require("express");
const router  = express.Router();
const {
  getAgents, getAgentProfile, getAgentStats,
  updateBrokerProfile, getReviews, addReview,
  verifyBroker, toggleBlockBroker,
} = require("../controllers/agentController");
const { protect }    = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.get("/",          getAgents);
router.get("/:id",       getAgentProfile);
router.get("/:id/stats", getAgentStats);
router.get("/:id/reviews", getReviews);

// Authenticated
router.put("/profile",       protect, updateBrokerProfile);
router.post("/:id/reviews",  protect, addReview);

// Admin only
router.put("/:id/verify", protect, adminMiddleware, verifyBroker);
router.put("/:id/block",  protect, adminMiddleware, toggleBlockBroker);

module.exports = router;
