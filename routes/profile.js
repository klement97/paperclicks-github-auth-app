const express = require('express');
const router = express.Router();
const axios = require('axios');
const { User } = require('../models');

router.get('/', ensureAuthenticated, async (req, res) => {
    const user = await User.findByPk(req.user.id);
    const repos = await axios.get('https://api.github.com/user/starred', {
        headers: { 'Authorization': `token ${user.accessToken}` }
    });
    res.json({
        profile: {
            username: user.username,
            displayName: user.displayName
        },
        starredRepos: repos.data
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
