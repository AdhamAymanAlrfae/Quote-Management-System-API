const { Router } = require("express");
const {
  createUser,
  getOneUser,
  getAllUsers,
  updateUser,
  deleteUser,
  changePassword,
} = require("../../Controllers/userController");

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
} = require("../../Validators/userValidators");

const router = Router();

router.route("/").post(createUserValidator, createUser).get(getAllUsers);

router
  .route("/:id")
  .get(getUserValidator, getOneUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.route("/change-password/:id").put(changePasswordValidator, changePassword)



module.exports = router;
