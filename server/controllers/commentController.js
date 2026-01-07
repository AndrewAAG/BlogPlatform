const pool = require('../config/db');

// Get all comments for a specific post
exports.getCommentsByPostId = async (req, res) => {
    try {
        const postId = req.params.postId || req.params.id;
        
        // Fetch comments with author details
        // Ordered by created_at ASC to ensure we process parents before children (if id sequential) 
        // or just to have chronological order for replies
        const [comments] = await pool.query(
            `SELECT c.*, u.name as author_name, u.profile_picture as author_avatar 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.post_id = ? 
             ORDER BY c.created_at ASC`,
            [postId]
        );

        // Transform flat list to nested tree
        const commentMap = {};
        const rootComments = [];

        // First pass: Initialize map and replies array
        comments.forEach(comment => {
            comment.replies = [];
            commentMap[comment.id] = comment;
        });

        // Second pass: Link children to parents
        comments.forEach(comment => {
            if (comment.parent_id) {
                if (commentMap[comment.parent_id]) {
                    commentMap[comment.parent_id].replies.push(comment);
                }
            } else {
                rootComments.push(comment);
            }
        });

        res.json(rootComments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add a comment (or reply)
exports.addComment = async (req, res) => {
    try {
        const postId = req.params.postId || req.params.id;
        const { content, parent_id } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const [result] = await pool.query(
            'INSERT INTO comments (content, post_id, user_id, parent_id) VALUES (?, ?, ?, ?)',
            [content, postId, userId, parent_id || null]
        );

        // Fetch the newly created comment to return it with author details
        const [newComment] = await pool.query(
            `SELECT c.*, u.name as author_name, u.profile_picture as author_avatar 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             WHERE c.id = ?`,
            [result.insertId]
        );

        res.json(newComment[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Edit a comment
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        // Check verification (ownership)
        const [comment] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [id]);
        if (comment.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment[0].user_id !== userId) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await pool.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);

        res.json({ message: 'Comment updated', content }); // Return updated content
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check verification (ownership)
        const [comment] = await pool.query('SELECT user_id FROM comments WHERE id = ?', [id]);
        if (comment.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment[0].user_id !== userId) {
            return res.status(403).json({ message: 'User not authorized' });
        }

        await pool.query('DELETE FROM comments WHERE id = ?', [id]);

        res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
