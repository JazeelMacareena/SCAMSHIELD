
const express = require("express");
const router = express.Router();

const { registerUser, signIn } = require("../controllers/userController");

// Register
router.post("/users", registerUser);

// Sign in
router.post("/signin", signIn);

// Sign out
router.get("/signout", (req, res) => {
  res.json({ message: "Sign out successful" });
});

module.exports = router;
