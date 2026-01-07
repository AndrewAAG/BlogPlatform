const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const allowedOrigins = [
  'http://localhost:5173',                     
  'https://blog-platform-andrew.netlify.app'    
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, Mobile Apps, Server-to-Server)
    if (!origin) return callback(null, true);
  
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked Origin:', origin); 
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Izinkan cookies/token
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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