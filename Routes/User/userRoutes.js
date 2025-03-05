const { Router } = require("express");
const {
  getOneUser,
  updateLogeUser,
  changePassword,
} = require("../../Controllers/userController");

const {
  getUserValidator,
  updateLogeUserValidator,
  changePasswordValidator,
} = require("../../Validators/userValidators");

const { verifyJWT } = require("../../Middlewares/verifyJWT");
const { allowTo } = require("../../Middlewares/allowTo");
const { handelUserId } = require("../../Middlewares/logeUserData");

const router = Router();

router
  .route("/my-data")
  .get(verifyJWT, allowTo("user"), handelUserId, getUserValidator, getOneUser)
  .put(
    verifyJWT,
    allowTo("user"),
    handelUserId,
    updateLogeUserValidator,
    updateLogeUser
  );

router
  .route("/change-my-password")
  .put(
    verifyJWT,
    allowTo("user"),
    handelUserId,
    changePasswordValidator,
    changePassword
  );

module.exports = router;
