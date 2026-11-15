
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

module.exports = mongoose.model("Indicator", indicatorSchema);
