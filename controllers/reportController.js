
const Report = require("../models/Report");

// Create a report
const createReport = async (req, res) => {
    try {
        const { title, scamType, description, evidence } = req.body;

        if (!title || !scamType || !description) {
            return res.status(400).json({
                error: "Title, scam type, and description are required"
            });
        }

        const report = await Report.create({
            title,
            scamType,
            description,
            evidence,
            reportedBy: req.auth._id
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reports with search and filtering
const getReports = async (req, res) => {
    try {
        const { q, type, status } = req.query;

        const filter = {};

        if (type) filter.scamType = type;
        if (status) filter.status = status;

        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ];
        }

        const reports = await Report.find(filter)
            .populate("reportedBy", "name")
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single report
const getReportById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId)
            .populate("reportedBy", "name");

        if (!report) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a report
const updateReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);

        if (!report) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        if (
            report.reportedBy.toString() !== req.auth._id &&
            req.auth.role !== "admin"
        ) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        const { title, scamType, description, evidence } = req.body;

        if (title !== undefined) report.title = title;
        if (scamType !== undefined) report.scamType = scamType;
        if (description !== undefined) report.description = description;
        if (evidence !== undefined) report.evidence = evidence;

        await report.save();

        res.json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a report
const deleteReport = async (req, res) => {
    try {
        const report = await Report.findById(req.params.reportId);

        if (!report) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        if (
            report.reportedBy.toString() !== req.auth._id &&
            req.auth.role !== "admin"
        ) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        await report.deleteOne();

        res.json({
            message: "Report deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export all controller functions
module.exports = {
    createReport,
    getReports,
    getReportById,
    updateReport,
    deleteReport
};
