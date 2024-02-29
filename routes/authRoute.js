const express = require("express");
const app = express();
const router = express.Router();
const { login, register, updateUser } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/updateuser").patch(authMiddleware, updateUser);

module.exports = router;
