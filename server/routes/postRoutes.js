const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// @route   GET /posts
// @desc    Get all posts
// @access  Public
router.get('/', postController.getAllPosts);

// @route   GET /posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', postController.getPostById);

// @route   GET /posts/:id/comments
// @desc    Get all comments for a post
// @access  Public
router.get('/:id/comments', commentController.getCommentsByPostId);

// @route   POST /posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', auth, commentController.addComment);

module.exports = router;
