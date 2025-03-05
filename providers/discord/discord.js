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
          if (user.id !== profile.id) {
            

            user.providerId = profile.id;
            user.provider = "discord";
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
