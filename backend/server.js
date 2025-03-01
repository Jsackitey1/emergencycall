require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create express app
const app = express();

app.use(cors({
      origin: 'http://localhost:5173'
    }));
 
// Middleware
// to allow us access req
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// routes
app.use('/', (req, res) => {
    res.send('Welcome to the server');
});

// connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        // process.env.PORT is for deployment
        app.listen(4000, () => {
            console.log("Server is listening on port 4000");
        })
    })
    .catch((err) => {
        console.log(err);
    })