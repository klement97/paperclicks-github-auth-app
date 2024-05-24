const express = require('express');
const session = require('express-session');
const passport = require('passport');
const {Sequelize} = require('sequelize');
require('dotenv').config();

const app = express();

// PostgreSQL connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Passport setup
require('./passportConfig');
app.use(passport.initialize());
app.use(passport.session({}));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Sync database
sequelize.sync().then(() => console.log('Database synced'));
