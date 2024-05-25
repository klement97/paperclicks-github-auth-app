const IVersionControlClient = require("./interfaces/iVersionControlClient");
const axios = require("axios");

class GitHubClient extends IVersionControlClient {

  constructor() {
    super();
    this.baseURL = "https://api.github.com";
  }

  async getUserProfile(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: {'Authorization': `token ${accessToken}`}
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }


  async getStarredRepos(accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/user/starred`, {
        headers: {'Authorization': `token ${accessToken}`}
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch starred repos: ${error.message}`);
    }
  }
}

module.exports = GitHubClient;