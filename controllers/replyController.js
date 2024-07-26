const Reply = require('../models/Reply');
const { generateReplyID } = require('../utils/idGenerators');

// Create a new reply
exports.createReply = async (req, res) => {
    try {
        const { BookingID, AccountID, ReplyContent, ReplyDate } = req.body;
        const newReply = new Reply({
            ReplyID: await generateReplyID(),
            BookingID,
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
exports.getReplyByBookingId = async (req, res) => {
    try {
        const { BookingID } = req.params;
        const replies = await Reply.find({ BookingID });
        res.status(200).json(replies);
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
        const updatedReply = await Reply.findOneAndUpdate(
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
        await Reply.findOneAndDelete(id);
        res.json({ message: 'Reply deleted successfully' });
    } catch (error) {
        console.error('Error deleting reply:', error);
        res.status(500).json({ error: 'Server error' });
    }
};



