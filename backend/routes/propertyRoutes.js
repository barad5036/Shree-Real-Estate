const express = require("express");
const router  = express.Router();
const {
  getProperties,
  getNearbyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  submitLead,
  toggleFavorite,
  getFavorites,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

const withUpload = (req, res, next) =>
  upload.array("images", 10)(req, res, err => {
    if (err) { res.status(400); return next(new Error(err.message)); }
    next();
  });

// Public
router.get("/",        getProperties);
router.get("/nearby",  getNearbyProperties);
router.get("/my",      protect, getMyProperties);
router.get("/favorites", protect, getFavorites);
router.get("/:id",     getPropertyById);

// Broker / admin
router.post("/",    protect, authorize("broker", "admin"), withUpload, createProperty);
router.put("/:id",  protect, authorize("broker", "admin"), withUpload, updateProperty);
router.delete("/:id", protect, authorize("broker", "admin"), deleteProperty);

// Buyer interactions
router.post("/:id/lead",     submitLead);
router.post("/:id/favorite", protect, toggleFavorite);

module.exports = router;
