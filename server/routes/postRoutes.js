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

// @route   POST /posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, postController.createPost);

// @route   PUT /posts/:id
// @desc    Edit an existing post
// @access  Private
router.put('/:id', auth, postController.updatePost);

// @route   DELETE /posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
