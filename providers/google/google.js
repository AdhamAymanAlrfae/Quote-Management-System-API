const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const User = require("../../Models/userModel");
const {
  jwtAccessTokenGenerator,
  jwtRefreshTokenGenerator,
} = require("../../Utils/jwtTokenGenerator");
const {
  generateUniqueUsername,
} = require("../../Utils/generateUniqueUsername");

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_BASE_URL,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email =
          profile._json?.email || profile.emails?.[0]?.value || null;
        if (!email) {
          return done(
            new Error("Email is required but not provided by Google."),
            null
          );
        }

        let user = await User.findOne({ email });
        if (user) {
          if (user.id !== profile.id) {
            user.providerId = profile.id;
            user.provider = "google";
            await user.save();
          }
        } else {
          const baseUsername = profile.displayName || "user";
          const uniqueUsername = await generateUniqueUsername(
            baseUsername,
            User
          );

          user = await User.create({
            providerId: profile.id,
            username: uniqueUsername,
            email,
            provider: profile.provider,
          });
          await user.save();
        }
        const refreshToken = jwtRefreshTokenGenerator({ userId: user._id });
        const accessToken = jwtAccessTokenGenerator({
          userId: user._id,
          username: user.username,
          role: user.role,
        });

        return done(null, { user, accessToken, refreshToken });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
