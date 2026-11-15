
const Indicator = require("../models/Indicator");

// Create indicator
const createIndicator = async (req, res) => {
    try {
        const indicator = await Indicator.create({
            ...req.body,
            createdBy: req.auth._id
        });

        res.status(201).json(indicator);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all indicators
const getIndicators = async (req, res) => {
    try {
        const indicators = await Indicator.find().populate("createdBy", "name");
        res.json(indicators);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get indicator by ID
const getIndicatorById = async (req, res) => {
    try {
        const indicator = await Indicator.findById(req.params.id);

        if (!indicator) {
            return res.status(404).json({ error: "Indicator not found" });
        }

        res.json(indicator);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update indicator
const updateIndicator = async (req, res) => {
    try {
        const indicator = await Indicator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!indicator) {
            return res.status(404).json({ error: "Indicator not found" });
        }

        res.json(indicator);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete indicator
const deleteIndicator = async (req, res) => {
    try {
        const indicator = await Indicator.findByIdAndDelete(req.params.id);

        if (!indicator) {
            return res.status(404).json({ error: "Indicator not found" });
        }

        res.json({ message: "Indicator deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createIndicator,
    getIndicators,
    getIndicatorById,
    updateIndicator,
    deleteIndicator
};
