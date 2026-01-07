const pool = require('../config/db');

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Select user details excluding password
        const [user] = await pool.query(
            'SELECT id, name, email, profile_picture, bio, created_at FROM users WHERE id = ?',
            [id]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio } = req.body;
        const userId = req.user.id; // From auth middleware

        // Check verification (ownership)
        if (parseInt(id) !== userId) {
            return res.status(403).json({ message: 'User not authorized to update this profile' });
        }

        // Allow updating name and bio. 
        await pool.query(
            'UPDATE users SET name = ?, bio = ? WHERE id = ?',
            [name, bio, id]
        );

        // Fetch updated user to return
        const [updatedUser] = await pool.query(
            'SELECT id, name, email, profile_picture, bio, created_at FROM users WHERE id = ?',
            [id]
        );

        res.json(updatedUser[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Check verification (ownership)
        if (parseInt(id) !== userId) {
             return res.status(403).json({ message: 'User not authorized to update this profile' });
        }

        // Create URL (assuming server runs on localhost:5001)
        const protocol = req.protocol;
        const host = req.get('host');
        // Note: In production you might use S3 or similar. Here we use local static file.
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        await pool.query(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [fileUrl, id]
        );

        res.json({ 
            message: 'Profile picture updated',
            profile_picture: fileUrl 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
