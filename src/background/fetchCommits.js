const {User, Commit} = require('../models');
const GitHubClient = require("../clients/githubClient");

async function fetchCommits() {
    /* TODO(Optimization): Fetch commits in batches using Promise.all
    After fetching the commits process all of them in batches of 500 commits and do not hit the DB for each user
    instead collect all the commits and then insert them in the DB in batches.
     */
    const users = await User.findAll();

    for (const user of users) {
        // FIXME: Access token may expire if we have a scheduled job running rarely.
        const gitHubClient = new GitHubClient(user.accessToken);
        const starredRepos = await gitHubClient.getStarredRepos();
        const allCommits = [];

        for (const repo of starredRepos) {
            console.log("Fetching commits for repo: ", repo.full_name);
            const commits = await gitHubClient.getRepoCommits(repo.full_name);
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
