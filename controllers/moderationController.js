const Report = require("../models/Report");

// Get pending reports for moderation
const getModerationQueue = async (req, res) => {
  try {
    const reports = await Report.find({ status: "pending" })
      .populate("reportedBy", "name")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update report moderation status
const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({
        error: "Status must be verified or rejected"
      });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.reportId,
      { status },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getModerationQueue,
  updateReportStatus
};