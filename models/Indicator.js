
const mongoose = require("mongoose");

const indicatorSchema = new mongoose.Schema(
    {
        kind: {
            type: String,
            enum: ["keyword", "domain", "phone", "email"],
            required: true
        },
        value: {
            type: String,
            required: true,
            trim: true
        },
        weight: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        explanation: {
            type: String,
            required: true,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// The same kind + value cannot be added twice
indicatorSchema.index({ kind: 1, value: 1 }, { unique: true });

module.exports = mongoose.model("Indicator", indicatorSchema);
