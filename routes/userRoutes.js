
const express = require("express");
const router = express.Router();

const { registerUser, getAllUsers } = require("../controllers/userController");
const requireSignin = require("../middleware/requireSignin");
const requireRole = require("../middleware/requireRole");

// Register a new user
router.post("/", registerUser);

// Get all users (Admin only)
router.get("/", requireSignin, requireRole("admin"), getAllUsers);

module.exports = router;
