const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// @route   GET /posts
// @desc    Get all posts
// @access  Public
router.get('/', postController.getAllPosts);

module.exports = router;
