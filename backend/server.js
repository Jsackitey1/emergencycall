require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Express app
const app = express();
const server = http.createServer(app);
io = socketIo(server, {
    cors: { origin: ["http://localhost:5173/"] }
}) // Enable CORS 

// Middleware
app.use(cors());
app.use(express.json());

// Import and pass io to routes
const getObjects = require('./routes/getObjects');
const authRoutes = require('./routes/auth');
const locationRoutes = require('./routes/location');
const sosRoutes = require('./routes/sos')(io); // Pass io here

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api', getObjects); // This will handle /api/ route to show all objects

// This must come AFTER the other routes to catch all undefined API paths
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: "Nothing found here!" });
});

// WebSocket logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(4000, () => {
            console.log("🚀 Server running on port 4000");
        });
    })
    .catch(err => console.log(err));



    // require('dotenv').config();
    // const express = require('express');
    // const mongoose = require('mongoose');
    // const cors = require('cors');
    // const http = require('http');
    // const socketIo = require('socket.io');
    
    // // Express app
    // const app = express();
    // const server = http.createServer(app);
    // io = socketIo(server, {
    //     cors: { origin: ["http://localhost:5173/"] }
    // }) // Enable CORS 
    
    // // Middleware
    // app.use(cors());
    // app.use(express.json());
    
    // // Import and pass io to routes
    // const getObjects = require('./routes/getObjects');
    // const authRoutes = require('./routes/auth');
    // const locationRoutes = require('./routes/location');
    // const sosRoutes = require('./routes/sos')(io); // Pass io here
    
    // app.use('/api/auth', authRoutes);
    // app.use('/api/location', locationRoutes);
    // app.use('/api/sos', sosRoutes);
    // app.use('/api', getObjects);
    // app.use('/api/*', (req, res) => {
    //     res.status(404).json({ message: "Nothing found here!" });
    // });
    // // WebSocket logic
    // io.on('connection', (socket) => {
    //     console.log('A user connected:', socket.id);
    
    //     socket.on('disconnect', () => {
    //         console.log('User disconnected:', socket.id);
    //     });
    // });
    
    // // Connect to MongoDB
    // mongoose.connect(process.env.MONGO_URI)
    //     .then(() => {
    //         server.listen(4000, () => {
    //             console.log("🚀 Server running on port 4000");
    //         });
    //     })
    //     .catch(err => console.log(err));