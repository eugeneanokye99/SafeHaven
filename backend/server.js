const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Load config
dotenv.config();

// Connect to database
connectDB();

const app = express();

  
  // Apply CORS middleware
  app.use(cors());
  
// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/chat', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
