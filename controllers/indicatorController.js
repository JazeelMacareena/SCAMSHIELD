
const mongoose = require("mongoose");
const Indicator = require("../models/Indicator");

// Store values in one format so matching in /api/verify is reliable
const cleanValue = (kind, value) => {
    if (typeof value !== "string") return value;

    const v = value.trim().toLowerCase();
    return kind === "phone" ? v.replace(/[^\d+]/g, "") : v;
};

const isBadId = (id) => !mongoose.isValidObjectId(id);

// Create indicator (admin)
const createIndicator = async (req, res) => {
    try {
        const { kind, value, weight, explanation } = req.body || {};

        const indicator = await Indicator.create({
            kind,
            value: cleanValue(kind, value),
            weight,
            explanation,
            createdBy: req.auth._id
        });

        res.status(201).json(indicator);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "That indicator already exists" });
        }
        res.status(400).json({ error: error.message });
    }
};

// Get all indicators (public). Optional filter: ?kind=keyword
const getIndicators = async (req, res) => {
    try {
        const filter = {};
        if (req.query.kind) filter.kind = req.query.kind;

        const indicators = await Indicator.find(filter)
            .populate("createdBy", "name")
            .sort({ weight: -1, value: 1 });

        res.json(indicators);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get indicator by ID (public)
const getIndicatorById = async (req, res) => {
    try {
        if (isBadId(req.params.id)) {
            return res.status(400).json({ error: "Invalid indicator id" });
        }

        const indicator = await Indicator.findById(req.params.id);

        if (!indicator) {
            return res.status(404).json({ error: "Indicator not found" });
        }

        res.json(indicator);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update indicator (admin)
const updateIndicator = async (req, res) => {
    try {
        if (isBadId(req.params.id)) {
            return res.status(400).json({ error: "Invalid indicator id" });
        }

        const indicator = await Indicator.findById(req.params.id);

        if (!indicator) {
            return res.status(404).json({ error: "Indicator not found" });
        }

        const { kind, value, weight, explanation } = req.body || {};

        if (kind !== undefined) indicator.kind = kind;
        if (value !== undefined) indicator.value = cleanValue(indicator.kind, value);
        if (weight !== undefined) indicator.weight = weight;
        if (explanation !== undefined) indicator.explanation = explanation;

        await indicator.save();

        res.json(indicator);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "That indicator already exists" });
        }
        res.status(400).json({ error: error.message });
    }
};

// Delete indicator (admin)
const deleteIndicator = async (req, res) => {
    try {
        if (isBadId(req.params.id)) {
            return res.status(400).json({ error: "Invalid indicator id" });
        }

        const indicator = await Indicator.findByIdAndDelete(req.params.id);

        if (!indicator) {
            return res.status(404).json({ error: "Indicator not found" });
        }

        res.json({ message: "Indicator deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createIndicator,
    getIndicators,
    getIndicatorById,
    updateIndicator,
    deleteIndicator
};
