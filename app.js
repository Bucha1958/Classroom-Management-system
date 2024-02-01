const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { connectToDatabase } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const classRoutes = require('./src/routes/classRoutes');
const enrollRoutes = require('./src/routes/enrollRoutes');
const assignmentRoutes = require('./src/controllers/assignmentController');


require('./auth');

const app = express();

app.use(cors());
app.use(express.json());

connectToDatabase();

app.get("/", (req, res) => {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Welcome to Your App</title>
        </head>
        <body>
            <h1>Welcome to Stanley's Google classroom api</h1>
            <p>Click the link below to log in with Google:</p>
            <a href="/auth/google">Login with Google</a>
        </body>
        </html>
    `;

    res.send(html);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Use the authRoutes for authentication-related routes
app.use('/auth', authRoutes);
// use the classRoutes for CRUD operations 
app.use('/create', classRoutes);
app.use('/create', enrollRoutes);
app.use('/create',assignmentRoutes);

app.get('/auth/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
