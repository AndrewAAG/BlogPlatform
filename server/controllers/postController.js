const pool = require('../config/db');

exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const authorId = req.query.author_id;
    const offset = (page - 1) * limit;

    let baseQuery = `FROM posts p JOIN users u ON p.author_id = u.id`;
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push('(p.title LIKE ? OR p.excerpt LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    if (authorId) {
      whereConditions.push('p.author_id = ?');
      queryParams.push(authorId);
    }

    let whereClause = '';
    if (whereConditions.length > 0) {
      whereClause = ' WHERE ' + whereConditions.join(' AND ');
    }

    const query = `SELECT p.*, u.name as author_name, u.profile_picture as author_avatar ${baseQuery} ${whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    const finalQueryParams = [...queryParams, limit, offset];

    const countQuery = `SELECT COUNT(*) as total ${baseQuery} ${whereClause}`;
    
    // Get posts with author details
    const [posts] = await pool.query(query, finalQueryParams);

    // Get total count for pagination
    const [countResult] = await pool.query(countQuery, queryParams);
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

exports.getPostById = async (req, res) => {
  try {
    const [posts] = await pool.query(
      `SELECT p.*, u.name as author_name, u.profile_picture as author_avatar 
       FROM posts p 
       JOIN users u ON p.author_id = u.id 
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(posts[0]);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') { // MySQL doesn't have ObjectId, but keeping generic error structure
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};
