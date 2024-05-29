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
        const allCommits = [];

        for (const repo of starredRepos) {
            console.log("Fetching commits for repo: ", repo.full_name);
            const commits = await gitHubService.getRepoCommits(user.accessToken, repo.full_name);
            console.log("Commits fetched: ", commits.length);
            const commitRecords = commits.map(commit => ({
                repoName: repo.full_name,
                sha: commit.sha,
                date: commit.date
            }));
            allCommits.push(...commitRecords);
        }

        const chunkSize = process.env.CHUNK_SIZE || 500;
        for (let i = 0; i < allCommits.length; i += chunkSize) {
            const chunk = allCommits.slice(i, i + chunkSize);
            // Using the Upsert method to create or update records.
            // For reference https://www.postgresql.org/docs/current/sql-insert.html
            // See the ON CONFLICT DO UPDATE ... WHERE clause.
            await Commit.bulkCreate(chunk, {
                updateOnDuplicate: ['date']
            });
        }
    }
}

module.exports = fetchCommits;
