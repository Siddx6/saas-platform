const passport = require('passport');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  const User = require('../models/User.model');
  const Workspace = require('../models/Workspace.model');

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });
          if (user) return done(null, user);

          const workspace = await Workspace.create({
            name: `${profile.displayName}'s Workspace`,
          });

          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: 'google',
            isVerified: true,
            role: 'owner',
            workspaceId: workspace._id,
          });

          workspace.ownerId = user._id;
          workspace.memberIds = [user._id];
          await workspace.save();

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

module.exports = passport;