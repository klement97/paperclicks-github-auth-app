# Paperclicks GitHub OAuth

This is a JavaScript project that uses Node.js and Sequelize to interact with a PostgreSQL database. The project also integrates with the GitHub API for OAuth authentication.

## Prerequisites

- Docker

## Setup

1. Clone the repository:

```bash
git clone git@github.com:klement97/paperclicks-github-auth-app.git
```

2. Navigate to the project directory:

```bash
cd paperclicks-github-auth-app
```

3. Create a `.env` file in the root directory of the project and populate it with your environment variables. You can copy the `.env.example` file to get started

```bash
cp .env.example .env
```

4. Start the containers:

```bash
docker compose up
```

5. Run the migrations
```bash
docker exec paperclicks-github-auth-app-server-1 npm run migrate
```

## Usage

After completing the setup, you can visit `http://localhost:3000` in your web browser to interact with the application.