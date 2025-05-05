const passport = require("passport");
const { Strategy } = require("passport-github2");
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
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_BASE_URL,
      scope: ["user:email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile.emails?.[0]?.value || null;
        if (!email) {
          return done(
            new Error("Email is required but not provided by GitHub."),
            null
          );
        }

        let user = await User.findOne({ email });

        if (user) {
          // ✅ Check if this user was originally registered using GitHub
          if (user.provider !== "github" || user.providerId !== profile.id) {
            return done(
              new Error("This email is already associated with an account."),

              null
            );
          }
          // ✅ Proceed with existing GitHub user
        } else {
          // 🆕 Create new user
          const baseUsername = profile.username || "user"; // `displayName` is often undefined in GitHub profile
          const uniqueUsername = await generateUniqueUsername(
            baseUsername,
            User
          );

          user = await User.create({
            providerId: profile.id,
            username: uniqueUsername,
            email,
            provider: "github",
          });
        }

        // ✅ Generate tokens
        const refreshTokenJWT = jwtRefreshTokenGenerator({ userId: user._id });
        const accessTokenJWT = jwtAccessTokenGenerator({
          userId: user._id,
          username: user.username,
          role: user.role,
        });

        logger.info(`User ${user.email} authenticated via GitHub.`);

        return done(null, {
          user,
          accessToken: accessTokenJWT,
          refreshToken: refreshTokenJWT,
        });
      } catch (error) {
        logger.error("GitHub authentication failed:", error);
        return done(error, null);
      }
    }
  )
);
