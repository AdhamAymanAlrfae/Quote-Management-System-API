exports.handelUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.handelSubmittedBy = (req, res, next) => {
  req.body.submittedBy = req.user.id;
  next();
};

exports.adminHandelStatus = (req, res, next) => {
  if (req.user.role === "admin") {
    req.body.status = "approved";
  }
  next();
};

exports.userHandelStatus = (req, res, next) => {
  if (req.user.role === "user") {
    req.body.status = "pending";
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
