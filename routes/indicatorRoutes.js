
const express = require("express");
const router = express.Router();

const {
    createIndicator,
    getIndicators,
    getIndicatorById,
    updateIndicator,
    deleteIndicator
} = require("../controllers/indicatorController");

const requireSignin = require("../middleware/requireSignin");
const requireRole = require("../middleware/requireRole");

// Anyone can read
router.get("/", getIndicators);
router.get("/:id", getIndicatorById);

// Only admins can write
router.post("/", requireSignin, requireRole("admin"), createIndicator);
router.put("/:id", requireSignin, requireRole("admin"), updateIndicator);
router.delete("/:id", requireSignin, requireRole("admin"), deleteIndicator);

module.exports = router;
