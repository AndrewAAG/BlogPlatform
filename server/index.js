const express = require('express');
//const cors = require('cors');
const app = express();
require('dotenv').config();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  const allowedOrigins = [
    'http://localhost:5173',                      // Frontend Vite Localhost
    'https://blog-platform-andrew.netlify.app'    // Frontend Production
  ];

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Penting untuk cookies/token

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  next();
});

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