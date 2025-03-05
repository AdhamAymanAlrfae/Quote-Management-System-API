const jwt = require("jsonwebtoken");

const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");
const CustomError = require("../Utils/CustomError");

exports.verifyJWT = AsyncErrorHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new CustomError("Invalid Authentication Token. Please enter a token", 401)
    );
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (error, decoded) => {
    if (error) return next(error);
    
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
    
    next();
  });
});
