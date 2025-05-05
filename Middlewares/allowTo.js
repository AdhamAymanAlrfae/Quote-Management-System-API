const AsyncErrorHandler = require("../Middlewares/AsyncErrorHandler");
const CustomError = require("../Utils/CustomError");

exports.allowTo = (...roles) =>
  AsyncErrorHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are NOT allowed to access this route."));
    }
    next(null);
  });
