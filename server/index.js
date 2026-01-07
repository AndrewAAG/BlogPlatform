const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
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
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});