const Reply = require('../models/Reply');

const { generateReplyID } = require('../utils/idGenerators');

// Create a new reply
exports.createReply = async (req, res) => {
    try {
        const { CommentID, AccountID, ReplyContent, ReplyDate } = req.body;
        const newReply = new Reply({
            ReplyID: await generateReplyID(),
            CommentID,
            AccountID,
            ReplyContent,
            ReplyDate,
        });
        await newReply.save();
        res.status(201).json(newReply);
    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all replies for a specific comment by CommentID
exports.getReplyByCommentId = async (req, res) => {
    try {
        const { CommentID } = req.params;
        const replies = await Reply.find({ CommentID });
        res.json({ replies });
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a reply
exports.updateReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { ReplyContent } = req.body;
        const updatedReply = await Reply.findByIdAndUpdate(
            id,
            { ReplyContent },
            { new: true }
        );
        res.json(updatedReply);
    } catch (error) {
        console.error('Error updating reply:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a reply
exports.deleteReply = async (req, res) => {
    try {
        const { id } = req.params;
        await Reply.findByIdAndDelete(id);
        res.json({ message: 'Reply deleted successfully' });
    } catch (error) {
        console.error('Error deleting reply:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



