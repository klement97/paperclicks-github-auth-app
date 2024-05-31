const IVersionControlClient = require("./interfaces/iVersionControlClient");
const axios = require("axios");

class GitHubClient extends IVersionControlClient {

  constructor(accessToken) {
    super();
    this.accessToken = accessToken;
    this.baseURL = process.env.GITHUB_API_URL;
  }

  async getUserProfile() {
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: {'Authorization': `token ${this.accessToken}`}
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }


  async getStarredRepos() {
    try {
      const response = await axios.get(`${this.baseURL}/user/starred`, {
        headers: {'Authorization': `token ${this.accessToken}`}
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch starred repos: ${error.message}`);
    }
  }


  async getRepoCommits(repoFullName) {
    try {
      const url = `${this.baseURL}/repos/${repoFullName}/commits`;
      const response = await axios.get(url, {
        headers: { 'Authorization': `token ${this.accessToken}` }
      });
      return response.data.map(commit => ({
        sha: commit.sha,
        date: commit.commit.author.date
      }));
    } catch (error) {
      console.error(`Failed to fetch commits for ${repoFullName}: ${error.message}`);
      return [];
    }
  }
}

module.exports = GitHubClient;