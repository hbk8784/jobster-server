const mongoose = require("mongoose");

const connectionDB = (uri) => {
  return mongoose
    .connect(uri)
    .then(() => console.log("DB connected..."))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectionDB;
