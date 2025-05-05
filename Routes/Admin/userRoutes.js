const { Router } = require("express");
const {
  getOneUser,
  getAllUsers,
  deleteUser,
} = require("../../Controllers/userController");

const {
  getUserValidator,
  deleteUserValidator,

} = require("../../Validators/userValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");

const ROLE = require("../../Data/Roles");

const {
  changeUserRole,
  updateUserStatus,
  forceResetPassword,
  toggleEmailVerification,
} = require("../../Controllers/adminUserController");

const {
  changeUserRoleValidator,
  updateUserStatusValidator,
  forceResetPasswordValidator,
  toggleEmailVerificationValidator,
} = require("../../Validators/adminUserValidators");

const router = Router();
router.use(verifyJWT, allowTo(ROLE.ADMIN));

/**
 * 📦 Admin API Actions for Managing Users Safely (without invading privacy)
 *
 * ✅ Safe Actions:
 * - Ban/Suspend/Reactivate user accounts
 * - Add internal admin notes about user (visible only to admins)

 * 📚 Example Admin Routes:
 * - PATCH /admin/users/:id/status      → Suspend/Ban/Reactivate user
 * - POST  /admin/users/:id/notes       → Add internal admin note
 */


router.route("/").get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getOneUser)
  .delete(deleteUserValidator, deleteUser);


// Change user's role
router.route("/:id/role").patch(changeUserRoleValidator, changeUserRole);

// PATCH /admin/users/:id/status → Suspend/Ban/Reactivate user

// router.route("/:id/status").patch(updateUserStatusValidator, updateUserStatus);

// Send reset password email
router
  .route("/:id/force-reset-password")
  .post(forceResetPasswordValidator, forceResetPassword);

// PATCH /admin/users/:id/email-verification → Verify/Unverify email
router
  .route("/:id/email-verification")
  .patch(toggleEmailVerificationValidator, toggleEmailVerification);

module.exports = router;
