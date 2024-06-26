const cron = require('node-cron');
const fetchCommits = require('./background/fetchCommits');


// Schedule the task to run every day at midnight
cron.schedule('* * * * *', () => {
    console.log('Fetching commits...');
    fetchCommits().then(() => {
        console.log('Commits data fetched and stored successfully');
    }).catch((error) => {
        console.error(`Failed to fetch commits: ${error.message}`);
    });
});

console.log("Cron job registered and scheduled.");
