const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// @route   GET /posts
// @desc    Get all posts
// @access  Public
router.get('/', postController.getAllPosts);

// @route   GET /posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', postController.getPostById);

module.exports = router;
