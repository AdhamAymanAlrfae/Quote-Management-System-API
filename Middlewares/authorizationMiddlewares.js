const ROLE = require("../Data/Roles");
const customError = require("../Utils/CustomError");

exports.canModifyResource = (Model, resourceName, action) => {
  return async (req, res, next) => {
    const resource = await Model.findById(req.params.id);

    if (!resource) {
      return next(new customError(`${resourceName} not found`, 404));
    }

    // Allow admins to modify any resource
    if (req.user.role === ROLE.ADMIN) {
      return next();
    }

    // Allow only the user who submitted the resource to modify it
    if (resource.submittedBy.toString() !== req.user.id.toString()) {
      return next(
        new customError(
          `You are not authorized to ${action} this ${resourceName}`,
          403
        )
      );
    }

    next();
  };
};

exports.canModifyReview = (Model, resourceName, action) => {
  return async (req, res, next) => {
    const resource = await Model.findById(req.params.id)

    if (!resource) {
      return next(new customError(`${resourceName} not found`, 404));
    }

    // Allow admins to modify any resource except for updates
    if (req.user.role === ROLE.ADMIN && action !== "update") {
      return next();
    }

    // Allow only the user who created the review to update it
    if (
      action === "update" &&
      resource.user._id.toString() !== req.user.id.toString()
    ) {
      return next(
        new customError(
          `You are not authorized to ${action} this ${resourceName}`,
          403
        )
      );
    }

    // Allow admins to perform other actions or the user to delete their review
    if (resource.user._id.toString() !== req.user.id.toString()) {
      return next(
        new customError(
          `You are not authorized to ${action} this ${resourceName}`,
          403
        )
      );
    }

    next();
  };
};
