const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(400).json({ msg: "Token Not Found" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = { id: payload.id, user: payload.user };
    next();
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

module.exports = auth;

"jgljalgjajgjapgjajgpajg"