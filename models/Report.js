const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        scamType: {
            type: String,
            enum: [
                "phishing_link",
                "fake_job",
                "suspicious_message",
                "online_shopping",
                "investment",
                "other"
            ],
            required: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        evidence: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending"
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);