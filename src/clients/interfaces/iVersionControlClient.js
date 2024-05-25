class IVersionControlClient {
  constructor() {
    if (this.constructor === IVersionControlClient) {
      throw new Error("Cannot instantiate interface directly.");
    }
  }

  async getUserProfile(accessToken) {
    throw new Error("Method 'getUserProfile()' must be implemented.");
  }

  async getStarredRepos(accessToken) {
    throw new Error("Method 'getStarredRepos()' must be implemented.");
  }

  async getRepoCommits(accessToken, owner, repo) {
    throw new Error("Method 'getRepoCommits()' must be implemented.");
  }
}

module.exports = IVersionControlClient;
