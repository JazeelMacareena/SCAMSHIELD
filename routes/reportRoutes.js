
const express = require("express");
const router = express.Router();

const requireSignin = require("../middleware/requireSignin");

const {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport
} = require("../controllers/reportController");

// Create report
router.post("/", requireSignin, createReport);

// Get all reports
router.get("/", getReports);

// Get one report
router.get("/:reportId", getReportById);

// Update report
router.put("/:reportId", requireSignin, updateReport);

// Delete report
router.delete("/:reportId", requireSignin, deleteReport);

module.exports = router;
