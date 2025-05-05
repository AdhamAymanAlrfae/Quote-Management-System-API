const passport = require("passport");
const { Strategy } = require("passport-discord");
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
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_CALLBACK_BASE_URL,
      scope: ["identify", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const email = profile.email || null;
        if (!email) {
          return done(
            new Error("Email is required but not provided by Discord."),
            null
          );
        }

        let user = await User.findOne({ email });

        if (user) {
          if (user.provider !== "discord" || user.providerId !== profile.id) {
            return done(
              new Error("This email is already associated with an account."),
              null
            );
          }
        } else {
          // Create new user
          const baseUsername = profile.username || "user"; // `displayName` is not standard on Discord
          const uniqueUsername = await generateUniqueUsername(
            baseUsername,
            User
          );
          user = await User.create({
            providerId: profile.id,
            username: uniqueUsername,
            email,
            provider: "discord",
          });
        }

        // ✅ Generate tokens
        const refreshTokenJWT = jwtRefreshTokenGenerator({ userId: user._id });
        const accessTokenJWT = jwtAccessTokenGenerator({
          userId: user._id,
          username: user.username,
          role: user.role,
        });

        logger.info(`User ${user.email} authenticated via Discord.`);

        return done(null, {
          user,
          accessToken: accessTokenJWT,
          refreshToken: refreshTokenJWT,
        });
      } catch (error) {
        logger.error("Discord authentication failed:", error);
        return done(error, null);
      }
    }
  )
);
