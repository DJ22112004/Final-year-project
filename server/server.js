const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Import all route files for a complete API
const userRoutes = require('./routes/user.routes');
const medicationRoutes = require('./routes/medication.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const logRoutes = require('./routes/log.routes');


// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To accept JSON data in the body

// API Routes - The core of your application
app.use('/api/users', userRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/logs', logRoutes);


// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Setup for Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Your react app's address
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // This allows the frontend to join a user-specific room for targeted alerts
    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User with ID: ${userId} joined room.`);
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});


// This is a simple simulator for sending alerts every 2 minutes for demonstration.
// A real-world application would use a more robust scheduling system like node-cron
// to query the database for schedules that are due at the current time.
setInterval(() => {
    const mockAlert = {
        // In a real app, you would find a user ID for a schedule that is due
        userId: 'some_user_id_to_target', 
        message: 'Time for your scheduled medication!',
        medication: 'Simulated Pill'
    };
    
    // Emitting a general alert to all connected clients for this demo.
    console.log("Emitting medication_alert to all clients.");
    io.emit('medication_alert', mockAlert);

}, 120000); // 120,000 ms = 2 minutes


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

