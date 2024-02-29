const userModel = require("../model/userSchema");
const jwt = require("jsonwebtoken");

//LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ msg: "please fill all fields" });
    return;
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(400).json({ msg: "user not found" });
    return;
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    res.status(400).json({ msg: "Wrong Password Or Email" });
    return;
  } else {
    const token = await user.createJWT(process.env.JWT_TOKEN);
    const { name, _id, location, email } = user;
    res.status(200).json({ user: { name, _id, location, email, token } });
  }
};

//REGISTRATION
const register = async (req, res) => {
  try {
    const user = await userModel.create({ ...req.body });
    const token = user.createJWT(process.env.JWT_TOKEN);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(409).json({ msg: "Email already in use" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userInfo = await userModel.findByIdAndUpdate(
      { _id: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    const { _id, email, name, location } = userInfo;
    const token = await userInfo.createJWT(process.env.JWT_TOKEN);

    res.status(200).json({ user: { _id, email, name, location, token } });
  } catch (error) {
    res.status(400).send("error updating user profile");
  }
};

module.exports = {
  login,
  register,
  updateUser,
};
