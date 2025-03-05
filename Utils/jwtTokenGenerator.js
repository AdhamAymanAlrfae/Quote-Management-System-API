const jwt = require("jsonwebtoken");

exports.jwtRefreshTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });
};
exports.jwtAccessTokenGenerator = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
  });
};
