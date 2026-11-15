
const express = require("express");
const router = express.Router();

const requireSignin = require("../middleware/requireSignin");

const {
    createComment,
    getComments,
    updateComment,
    deleteComment
} = require("../controllers/commentController");

// Create comment
router.post("/:reportId/comments", requireSignin, createComment);

// Get comments
router.get("/:reportId/comments", getComments);

// Update comment
router.put("/comments/:commentId", requireSignin, updateComment);

// Delete comment
router.delete("/comments/:commentId", requireSignin, deleteComment);

module.exports = router;
