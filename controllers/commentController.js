const Comment = require("../models/Comment");
const Report = require("../models/Report");

// Add a comment to a report
const createComment = async (req, res) => {
    try {
        const { text, alsoReceived } = req.body;
        const { reportId } = req.params;

        if (!text || !text.trim()) {
            return res.status(400).json({
                error: "Comment text is required"
            });
        }

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        const comment = await Comment.create({
            reportId,
            author: req.auth._id,
            text: text.trim(),
            alsoReceived: alsoReceived || false
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get comments for a report
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            reportId: req.params.reportId
        })
            .populate("author", "name")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createComment, getComments };

// Update a comment
const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                error: "Comment not found"
            });
        }

        if (
            comment.author.toString() !== req.auth._id &&
            req.auth.role !== "admin"
        ) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        const { text, alsoReceived } = req.body;

        if (text !== undefined) {
            if (!text.trim()) {
                return res.status(400).json({
                    error: "Comment text cannot be empty"
                });
            }
            comment.text = text.trim();
        }

        if (alsoReceived !== undefined) {
            comment.alsoReceived = alsoReceived;
        }

        await comment.save();

        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({
                error: "Comment not found"
            });
        }

        if (
            comment.author.toString() !== req.auth._id &&
            req.auth.role !== "admin"
        ) {
            return res.status(403).json({
                error: "Access denied"
            });
        }

        await comment.deleteOne();

        res.json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};