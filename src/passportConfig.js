const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { User } = require('./models');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ where: { githubId: profile.id } });
        if (user) {
            done(null, user);
        } else {
            user = await User.create({
                githubId: profile.id,
                email: profile.emails[0].value,
                username: profile.username,
                displayName: profile.displayName,
                accessToken: accessToken
            });
            done(null, user);
        }
    } catch (err) {
        done(err, null);
    }
}));
