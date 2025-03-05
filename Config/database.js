const mongoose = require("mongoose");
const Logger = require("..//Utils/logger");

module.exports = databaseConnect = async () => {
  await mongoose
    .connect(process.env.DATA_BASE_URL)
    .then(Logger.info("Connected Database successfully"))
    .catch((err) =>
      Logger.error("Error During Connected To The Database " + err)
    );
};
