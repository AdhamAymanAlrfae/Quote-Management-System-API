const ROLES = require("../Data/Roles");

exports.handelUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.handelSubmittedBy = (req, res, next) => {
  req.body.submittedBy = req.user.id;
  next();
};

exports.setAdminApprovedStatus = (req, res, next) => {
  if (req.user.role !== ROLES.USER) {
    req.body.status = "approved";
  }
  next();
};

exports.statusFilter = (req, res, next) => {
  let statusFilter = { status: "approved" };
  req.statusFilter = statusFilter;
  next();
};

exports.userFilter = (req, res, next) => {
  let userFilter = { user: req.user.id };
  req.userFilter = userFilter;
  next();
};

exports.handleStatusByRole = (req, res, next) => {
  if (req.user.role === ROLES.USER) {
    req.body.status = "pending";
  } else {
    req.body.status = "approved";
  }
  next();
};

exports.handelBookReview = (req, res, next) => {
  console.log(req.params);
  if (!req.params.bookId) {
    return next(new Error("Book ID is required."));
  }
  req.body.book = req.params.bookId;
  next();
};
