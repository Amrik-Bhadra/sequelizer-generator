const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, verifyToken };
