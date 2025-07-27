const express = require('express');
const app = express();

const mongoose = require("mongoose");

const { PORT, mongoDBURI } = require('./config');

// models
const Url = require('./models/url.model');

// Middleware for parsing request body
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})
app.use(express.json());

// Home page 
app.get('/', (req, res) => {
    res.send("Hi");
})

// routes
const urlRoute = require('./routes/url.route');
app.use('/shorten', urlRoute);

// Connect to MongoDB
mongoose.connect(mongoDBURI)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log(`Connection to MongoDB failed: ${err}`)
    });

// Start server
app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT}`);
})