const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// @route   PUT /comments/:id
// @desc    Edit a comment
// @access  Private
router.put('/:id', auth, commentController.updateComment);

// @route   DELETE /comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
