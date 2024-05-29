const {User, Commit} = require('../models');
const GitHubClient = require("../clients/githubClient");
const axios = require("axios");

async function fetchCommits() {
    const users = await User.findAll();

    for (const user of users) {
        const gitHubService = new GitHubClient(user.accessToken);
        const starredReposResponse = await axios.get('https://api.github.com/user/starred', {
            headers: {'Authorization': `token ${user.accessToken}`}
        });
        const starredRepos = starredReposResponse.data;

        for (const repo of starredRepos) {
            console.log("Fetching commits for repo: ", repo.full_name);
            const commits = await gitHubService.getRepoCommits(user.accessToken, repo.full_name);
            console.log("Commits fetched: ", commits.length);

            for (const commit of commits) {
                // Check if commit already exists to avoid duplicates
                const existingCommit = await Commit.findOne({
                    where: {
                        sha: commit.sha,
                        repoName: repo.full_name
                    }
                });

                if (!existingCommit) {
                    await Commit.create({
                        repoName: repo.full_name,
                        sha: commit.sha,
                        date: commit.date
                    });
                }
            }
        }
    }
}

module.exports = fetchCommits;
