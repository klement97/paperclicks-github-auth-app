const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github', passport.authenticate('github', {scope: ['user:email', 'repo']}));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/profile');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
