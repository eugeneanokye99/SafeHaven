const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');


// Load config
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));


// Apply CORS middleware
app.use(cors());
  
// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/chat', require('./routes/chatRoutes'));
app.use('/map',require('./routes/mapRoutes'));
app.use('/notifications',require('./routes/notificationsRoutes'));


const PORT = process.env.PORT || 3000;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8080;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

require('./config/socket')(io);

io.listen(WEBSOCKET_PORT, () => {
  console.log(`WebSocket server running on port ${WEBSOCKET_PORT}`);
});
