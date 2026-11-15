const express = require("express");
const router = express.Router();

const {
  getModerationQueue,
  updateReportStatus
} = require("../controllers/moderationController");

const requireSignin = require("../middleware/requireSignin");
const requireRole = require("../middleware/requireRole");

router.get(
  "/reports",
  requireSignin,
  requireRole("moderator", "admin"),
  getModerationQueue
);

router.patch(
  "/reports/:reportId/status",
  requireSignin,
  requireRole("moderator", "admin"),
  updateReportStatus
);

module.exports = router;