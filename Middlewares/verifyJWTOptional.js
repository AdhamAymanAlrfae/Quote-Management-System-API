const jwt = require("jsonwebtoken");

exports.verifyJWTOptional = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(); //Guest user. Continue normally.
  }

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (error, decoded) => {
    if (!error) {
      req.user = {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role,
      };
    }
    next();
  });
};
