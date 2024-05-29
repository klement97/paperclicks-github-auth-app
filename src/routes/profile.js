const express = require('express');
const router = express.Router();
const {User, Commit} = require('../models');
const GitHubClient = require('../clients/githubClient');
const {Sequelize, cast} = require("sequelize");
const githubClient = new GitHubClient()


router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const userData = await githubClient.getUserProfile(user.accessToken);
        const starredRepos = await githubClient.getStarredRepos(user.accessToken);
        const commits = await Commit.findAll({
            attributes: [
                'repoName',
                [Sequelize.fn('date_trunc', 'day', Sequelize.col('date')), 'day'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'commitCount']
            ],
            where: {repoName: starredRepos.map(repo => repo.full_name)},
            group: ['repoName', Sequelize.fn('date_trunc', 'day', Sequelize.col('date'))],
            order: [
                ['repoName', 'ASC'],
                [Sequelize.fn('date_trunc', 'day', Sequelize.col('date')), 'ASC']
            ]
        });
        const commitsByRepo = {};

        commits.forEach(commit => {
            const repoName = commit.repoName;
            const date = commit.get('day').toISOString().split('T')[0];
            const commitCount = parseInt(commit.get('commitCount'));

            if (!commitsByRepo[repoName]) {
                commitsByRepo[repoName] = {};
            }

            if (!commitsByRepo[repoName][date]) {
                commitsByRepo[repoName][date] = 0;
            }

            commitsByRepo[repoName][date] += commitCount;
        });
        starredRepos.forEach(repo => {
            const repoName = repo.full_name;
            const commits = commitsByRepo[repoName] || {};
            // add commits to repo which should be an array of 2 arrays,
            // one for the dates and one for the number of commits
            repo.commitDates = Object.keys(commits);
            repo.commitCounts = Object.values(commits);
        });

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
                    full_name: repo.full_name,
                    description: repo.description,
                    html_url: repo.html_url,
                    owner: {
                        login: repo.owner.login,
                        html_url: repo.owner.html_url,
                    },
                    stargazers_count: repo.stargazers_count,
                    commitDates: repo.commitDates,
                    commitCounts: repo.commitCounts,
                    
                }
            })
        });
    } catch (error) {
        res.redirect('/');
    }

});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
