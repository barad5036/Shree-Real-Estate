const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(protect, adminMiddleware);

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/properties", getAllProperties);
router.put("/properties/:id/approve", approveProperty);
router.put("/properties/:id/reject", rejectProperty);
router.delete("/properties/:id", adminDeleteProperty);

router.get("/leads", getAllLeads);
router.get("/brokers", getBrokerPerformance);

// Backward compatible aliases for existing frontend calls.
router.put("/approve-property/:id", approveProperty);
router.put("/reject-property/:id", rejectProperty);
router.delete("/delete-property/:id", adminDeleteProperty);

module.exports = router;
