const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter user name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "please provide email"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      "Please fill a valid email address",
    ],
  },
  location: {
    type: String,
    trim: true,
    default: "My City",
  },

  password: {
    type: String,
    required: [true, "please provide password"],
  },
});

//hashing the password before saving it in the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//creting token for the registered user and user logging in
userSchema.methods.createJWT = function (tokenString) {
  return jwt.sign({ user: this.name, id: this._id }, tokenString, {
    expiresIn: "1d",
  });
};

//matching password with stored in datebase to the user inserted password
userSchema.methods.comparePassword = async function (userInput) {
  const isMatch = bcrypt.compare(userInput, this.password);
  return isMatch;
};

module.exports = mongoose.model("user", userSchema);
