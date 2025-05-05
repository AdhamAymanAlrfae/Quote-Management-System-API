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
const logger = require("../../Utils/logger");

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
          //  Prevent account conflict
          if (user.provider !== "google" || user.providerId !== profile.id) {
            return done(
              new Error("This email is already associated with an account."),
              null
            );
          }
        } else {
          //  Create new user
          const baseUsername = profile.displayName || "user";
          const uniqueUsername = await generateUniqueUsername(
            baseUsername,
            User
          );

          user = await User.create({
            providerId: profile.id,
            username: uniqueUsername,
            email,
            provider: "google",
          });
        }

        // ✅ Generate JWT tokens
        const refreshTokenJWT = jwtRefreshTokenGenerator({ userId: user._id });
        const accessTokenJWT = jwtAccessTokenGenerator({
          userId: user._id,
          username: user.username,
          role: user.role,
        });

        logger.info(`User ${user.email} authenticated via Google.`);

        return done(null, {
          user,
          accessToken: accessTokenJWT,
          refreshToken: refreshTokenJWT,
        });
      } catch (error) {
        logger.error("Google authentication failed:", error);
        return done(error, null);
      }
    }
  )
);
