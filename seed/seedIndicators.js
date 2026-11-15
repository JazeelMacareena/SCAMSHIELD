
// Run from the project root:  node seed/seedIndicators.js
// Needs MONGODB_URI in .env and at least one admin user (createdBy is required).

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Indicator = require("../models/Indicator");

const data = [
    ["keyword", "pay a training fee", 5, "Real employers never ask you to pay to start a job."],
    ["keyword", "gift card", 4, "Scammers ask for gift cards because they are hard to trace."],
    ["keyword", "your account has been suspended", 4, "Fake urgent alert used to push you to click a link."],
    ["keyword", "verify your password", 4, "Legitimate companies do not ask for your password by message."],
    ["keyword", "guaranteed returns", 4, "No real investment can guarantee returns."],
    ["keyword", "do not tell anyone", 3, "Secrecy is used to stop you from asking for a second opinion."],
    ["keyword", "wire transfer", 3, "Irreversible payment method often requested in scams."],
    ["keyword", "package could not be delivered", 3, "Common fake parcel-delivery text."],
    ["keyword", "canada revenue agency", 3, "CRA impersonation: the CRA does not demand payment by gift card or text."],
    ["keyword", "act now", 2, "Artificial urgency to rush your decision."],
    ["domain", "rbc-secure-login.com", 5, "Look-alike bank login page, not the real RBC domain."],
    ["domain", "paypa1.com", 5, "Look-alike of paypal.com (the letter l replaced by 1)."],
    ["domain", "canadapost-tracking.top", 4, "Fake Canada Post tracking site on a cheap domain."],
    ["domain", "cra-refund.net", 5, "Fake refund site pretending to be the CRA."],
    ["phone", "+14165550199", 4, "Number reported in fake CRA phone calls."],
    ["email", "hr-recruiting@gmail-jobs.com", 4, "Fake recruiter email from a look-alike domain."]
];

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
        throw new Error("No admin user found. Make one admin first (change a user's role to admin in Atlas), then run this again.");
    }

    await Indicator.deleteMany({});
    await Indicator.insertMany(
        data.map(([kind, value, weight, explanation]) => ({
            kind,
            value: value.toLowerCase(),
            weight,
            explanation,
            createdBy: admin._id
        }))
    );

    console.log(`Seeded ${data.length} indicators (created by ${admin.email})`);
    await mongoose.disconnect();
};

run().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
