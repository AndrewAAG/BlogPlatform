const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches CLIENT_URL or localhost (for dev)
    // Normalize CLIENT_URL to ensure no trailing slash (common user error)
    const clientUrl = (process.env.CLIENT_URL || '').replace(/\/$/, '');
    const allowedOrigins = [
      clientUrl, 
      'http://localhost:5173', 
      'http://localhost:5001',
      'https://blog-platform-andrew.netlify.app' // Hardcoded for immediate fix
    ];
    
    if (allowedOrigins.includes(origin) || !clientUrl) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json()); // To read JSON data from request body

app.get('/', (req, res) => {
  res.send('API Running');
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/comments', require('./routes/commentRoutes'));
app.use('/users', require('./routes/userRoutes'));

// Serve static directory for uploads
app.use('/uploads', express.static('uploads'));


// Run Server
// Export app for Vercel, but always listen if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;