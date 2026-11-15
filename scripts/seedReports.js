const mongoose = require("mongoose");
require("dotenv").config();

const Report = require("../models/Report");
const User = require("../models/User");

const sampleReports = [
    {
        title: "Fake Amazon delivery text",
        scamType: "phishing_link",
        description: "Received a text claiming my Amazon package could not be delivered. It included a suspicious link asking for payment information.",
        evidence: "SMS message"
    },
    {
        title: "Fake remote data entry job",
        scamType: "fake_job",
        description: "A recruiter offered a remote data entry job with unusually high pay but requested an upfront registration fee.",
        evidence: "Email"
    },
    {
        title: "Fake CRA phone call",
        scamType: "suspicious_message",
        description: "Someone claiming to work for the CRA threatened legal action unless I immediately paid money using gift cards.",
        evidence: "Phone call"
    },
    {
        title: "Marketplace laptop scam",
        scamType: "online_shopping",
        description: "A seller advertised a laptop at a very low price and requested payment before allowing an inspection.",
        evidence: "Facebook Marketplace"
    },
    {
        title: "Fake cryptocurrency investment",
        scamType: "investment",
        description: "A person promised guaranteed cryptocurrency returns and pressured me to transfer money into an unknown platform.",
        evidence: "Social media"
    },
    {
        title: "Bank account verification text",
        scamType: "phishing_link",
        description: "Received a message claiming my bank account would be suspended unless I verified my details through a link.",
        evidence: "SMS message"
    },
    {
        title: "Fake work from home opportunity",
        scamType: "fake_job",
        description: "An online job offer promised thousands of dollars weekly for simple tasks but required an initial payment.",
        evidence: "Email"
    },
    {
        title: "Suspicious package fee request",
        scamType: "phishing_link",
        description: "A message claimed a parcel was being held and requested a small redelivery fee through an unfamiliar website.",
        evidence: "SMS message"
    },
    {
        title: "Fake government refund",
        scamType: "suspicious_message",
        description: "Received an email claiming I was eligible for a government refund and asking for banking details.",
        evidence: "Email"
    },
    {
        title: "Used phone payment scam",
        scamType: "online_shopping",
        description: "A seller requested an e-transfer for a used phone but stopped responding after receiving payment.",
        evidence: "Online marketplace"
    },
    {
        title: "Fake investment advisor",
        scamType: "investment",
        description: "An individual claiming to be an investment advisor promised guaranteed profits if I sent money immediately.",
        evidence: "Social media"
    },
    {
        title: "Suspicious password reset email",
        scamType: "phishing_link",
        description: "Received an unexpected password reset email containing a link to a website that did not match the real service.",
        evidence: "Email"
    },
    {
        title: "Fake part-time student job",
        scamType: "fake_job",
        description: "A supposed employer offered a part-time student position but asked for personal banking information before an interview.",
        evidence: "Email"
    },
    {
        title: "Fake delivery company call",
        scamType: "suspicious_message",
        description: "Someone pretending to represent a delivery company requested personal information to release a package.",
        evidence: "Phone call"
    },
    {
        title: "Online store never delivered order",
        scamType: "online_shopping",
        description: "An unfamiliar online store accepted payment for electronics but never delivered the order or replied to messages.",
        evidence: "Website"
    },
    {
        title: "Guaranteed stock returns offer",
        scamType: "investment",
        description: "A group chat advertised guaranteed stock market profits and requested deposits into a private account.",
        evidence: "Messaging app"
    },
    {
        title: "Fake Microsoft security alert",
        scamType: "phishing_link",
        description: "A pop-up claimed my computer was infected and instructed me to call a suspicious technical support number.",
        evidence: "Website pop-up"
    },
    {
        title: "Fake internship application fee",
        scamType: "fake_job",
        description: "An organization advertised an internship but demanded an application processing fee before reviewing applications.",
        evidence: "Email"
    },
    {
        title: "Rental deposit scam",
        scamType: "other",
        description: "A person advertised an apartment below market price and requested a deposit before arranging a viewing.",
        evidence: "Online listing"
    },
    {
        title: "Suspicious prize notification",
        scamType: "other",
        description: "Received a message claiming I had won a prize but needed to pay a fee and provide personal information to claim it.",
        evidence: "SMS message"
    }
];

const seedReports = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const user = await User.findOne();

        if (!user) {
            throw new Error("No users found. Create a user account before seeding reports.");
        }

        const reports = sampleReports.map((report) => ({
            ...report,
            reportedBy: user._id,
            status: "pending"
        }));

        await Report.insertMany(reports);

        console.log("20 sample reports added successfully.");

        await mongoose.disconnect();
    } catch (error) {
        console.error("Error seeding reports:", error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedReports();