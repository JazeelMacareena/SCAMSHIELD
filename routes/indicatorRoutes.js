
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

router.post("/", requireSignin, createIndicator);
router.get("/", getIndicators);
router.get("/:id", getIndicatorById);
router.put("/:id", requireSignin, updateIndicator);
router.delete("/:id", requireSignin, deleteIndicator);

module.exports = router;
