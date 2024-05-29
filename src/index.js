const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require("node:path");
const {sequelize} = require('./models');
require('dotenv').config();
require('./schedule');

const app = express();

// Middleware
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('pages/index', {client_id: process.env.GITHUB_CLIENT_ID});
});

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
