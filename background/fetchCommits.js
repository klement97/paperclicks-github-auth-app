const axios = require('axios');
const {User, Commit} = require('../models'); // Update Commit model to use Sequelize

const fetchCommits = async () => {
    const users = await User.findAll();
    users.forEach(async (user) => {
        const repos = await axios.get('https://api.github.com/user/starred', {
            headers: {'Authorization': `token ${user.accessToken}`}
        });
        repos.data.forEach(async (repo) => {
            const commits = await axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits`, {
                headers: {'Authorization': `token ${user.accessToken}`}
            });
            commits.data.forEach(async (commit) => {
                await Commit.create({
                    userId: user.id,
                    repoName: repo.name,
                    commitDate: commit.commit.author.date,
                });
            });
        });
    });
};

module.exports = fetchCommits;
