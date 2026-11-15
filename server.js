
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reportRoutes = require("./routes/reportRoutes");
const indicatorRoutes = require("./routes/indicatorRoutes");
const moderationRoutes = require("./routes/moderationRoutes");


// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/indicators", indicatorRoutes);
app.use("/api/moderation", moderationRoutes);

// Report routes
app.use("/api/reports", reportRoutes);

// Comment routes
app.use("/api/reports", commentRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("SCAMSHIELD API is running!");
});

// Server port
const PORT = process.env.PORT || 5050;

// Start server after MongoDB connects
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`SCAMSHIELD server running on port ${PORT}`);
            console.log(`Local URL: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start SCAMSHIELD:", error.message);
        process.exit(1);
    }
};

// Run server
startServer();
