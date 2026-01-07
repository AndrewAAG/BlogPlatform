const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const upload = require('../middleware/upload');

// @route   GET /users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', userController.getUserProfile);

// @route   PUT /users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', auth, userController.updateUserProfile);

// @route   POST /users/:id/photo
// @desc    Upload profile picture
// @access  Private
router.post('/:id/photo', auth, upload.single('image'), userController.uploadProfilePicture);

module.exports = router;
