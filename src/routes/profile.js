const express = require('express');
const router = express.Router();
const {User} = require('../models');
const GitHubClient = require('../clients/githubClient');
const githubClient = new GitHubClient()


router.get('/', ensureAuthenticated, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const userData = await githubClient.getUserProfile(user.accessToken);
  const starredRepos = await githubClient.getStarredRepos(user.accessToken);
  res.render('pages/success', {
    userData: {
      username: userData.login,
      displayName: userData.name,
      avatar: userData.avatar_url,
      url: userData.html_url,
      location: userData.location,
      email: userData.email,
      bio: userData.bio,
    },
    starredRepos: starredRepos.map(repo => {
      return {
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        owner: {
          login: repo.owner.login,
          html_url: repo.owner.html_url,
        },
        stargazers_count: repo.stargazers_count
      }
    }),
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
