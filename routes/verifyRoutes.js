
const express = require("express");
const router = express.Router();

const { verify } = require("../controllers/verifyController");

// Anyone can check a message or link
router.post("/", verify);

module.exports = router;
