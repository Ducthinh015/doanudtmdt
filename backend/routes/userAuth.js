const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Authentication denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "bookStore123", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired. Please sign-in again" });
    }
    req.user = user;
    next();
  });
};
module.exports = { authenticationToken };
