const { body } = require("express-validator");

const validatorMiddlewares = require("../Middlewares/validatorMiddlewares");
const customError = require("../Utils/CustomError");

exports.createDailyQuoteValidators = [
    body("quoteId")
        .notEmpty()
        .withMessage("The Quote ID is required")
        .bail()
        .isMongoId()
        .withMessage("Invalid Quote ID")
        ,
    body("date")
        .notEmpty()
        .withMessage("The Date is required")
        .isDate()
        .withMessage("Invalid Date format").custom((value)=>{
          const scheduleDate = new Date(value);
          const currentDate = new Date();

          // Reset time to midnight for accurate comparison
          currentDate.setHours(0, 0, 0, 0);
          scheduleDate.setHours(0, 0, 0, 0);
          if (scheduleDate < currentDate) {
            throw new customError("The Date should be in the future", 400);
          }
          return true;
        }),
    validatorMiddlewares,
]
