const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use((req, res, next) => {
  res.header('X-Debug-Code-Active', 'YES_IT_IS_RUNNING');

  const TRACER_VALUE = 'TEST-DEBUG-MODE';
  
  res.header('Access-Control-Allow-Origin', TRACER_VALUE);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  next();
});

app.use(express.json()); // To read JSON data from request body

app.get('/debug-env', (req, res) => {
  res.json({
    message: "Server is running",
    env_client_url: process.env.CLIENT_URL || "NOT_SET", 
    headers_received: req.headers
  });
});

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