const User = require("../Models/userModel");
const AsyncErrorHandler = require("../Utils/AsyncErrorHandler");

const {
  createDoc,
  getOneDoc,
  getAllDoc,
  deleteDoc,
} = require("./index");


exports.createUser = createDoc(User);

exports.getOneUser = getOneDoc(User);

exports.getAllUsers = getAllDoc(User);

exports.updateUser = AsyncErrorHandler(async (req, res, next) => {
  delete req.body.password;
  const document = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).exec();

  if (!document) {
    return next(
      new CustomError(
        `The document could not be found for this ID ${req.params.id}`,
        404
      )
    );
  }
  await document.save();
  res.status(200).json({ status: "success", data: document });
});


exports.changePassword = AsyncErrorHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    { password: req.body.password },
    {
      new: true,
    }
  ).exec();

  if (!document) {
    return next(
      new CustomError(
        `The document could not be found for this ID ${req.params.id}`,
        404
      )
    );
  }
  await document.save();
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({ status: "success", data: document });
});

exports.deleteUser = deleteDoc(User);


exports.updateLogeUser = AsyncErrorHandler(async (req, res, next) => {
 
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
    },
    {
      new: true,
    }
  ).exec();

  if (!document) {
    return next(
      new CustomError(
        `The document could not be found for this ID ${req.params.id}`,
        404
      )
    );
  }
  await document.save();
  res.status(200).json({ status: "success", data: document });
});