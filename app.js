const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectToDatabase } = require('./src/config/database');

const authRoutes = require('./src/routes/authRoutes');
const app = express();

app.use(cors());
// Set up middleware
app.use(express.json()); 
// Use authentication routes
app.use('/auth', authRoutes);


// Database connection
connectToDatabase()

app.get("/", (req, res) => {
    res.json("ok")
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

