
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        if (error.reason?.servers) {
            for (const [address, server] of error.reason.servers) {
                console.log("\nServer:", address);
                console.log("State:", server.type);
                console.log("Error:", server.error?.message);
            }
        }

        throw error;
    }
};

module.exports = connectDB;
