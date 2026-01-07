const pool = require('../config/db');

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get posts with author details
    const [posts] = await pool.query(
      `SELECT p.*, u.name as author_name, u.profile_picture as author_avatar 
       FROM posts p 
       JOIN users u ON p.author_id = u.id 
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Get total count for pagination
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM posts');
    const totalPosts = countResult[0].total;

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
