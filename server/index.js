const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json()); // To read JSON data from request body

app.get('/', (req, res) => {
  res.send('Test Backend');
});

// Routes
app.use('/auth', require('./routes/authRoutes'));

// Run Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});