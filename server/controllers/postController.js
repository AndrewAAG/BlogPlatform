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
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, excerpt, content, tags } = req.body;
        const authorId = req.user.id; // From auth middleware

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Handle tags: ensure it is a JSON string or array suitable for DB (using JSON type)
        const tagsValue = Array.isArray(tags) ? JSON.stringify(tags) : (tags || "[]");

        const [result] = await pool.query(
            'INSERT INTO posts (title, excerpt, content, tags, author_id) VALUES (?, ?, ?, ?, ?)',
            [title, excerpt, content, tagsValue, authorId]
        );

        res.status(201).json({ id: result.insertId, message: 'Post created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update an existing post
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, tags } = req.body;
        const userId = req.user.id;

        // Check verification (ownership)
        const [posts] = await pool.query('SELECT author_id FROM posts WHERE id = ?', [id]);
        
        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (posts[0].author_id !== userId) {
            return res.status(403).json({ message: 'User not authorized to edit this post' });
        }
        
        const tagsValue = Array.isArray(tags) ? JSON.stringify(tags) : (tags || "[]");

        await pool.query(
            'UPDATE posts SET title = ?, excerpt = ?, content = ?, tags = ? WHERE id = ?',
            [title, excerpt, content, tagsValue, id]
        );

        res.json({ message: 'Post updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check verification (ownership)
        const [posts] = await pool.query('SELECT author_id FROM posts WHERE id = ?', [id]);
        
        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (posts[0].author_id !== userId) {
            return res.status(403).json({ message: 'User not authorized to delete this post' });
        }

        await pool.query('DELETE FROM posts WHERE id = ?', [id]);

        res.json({ message: 'Post deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
