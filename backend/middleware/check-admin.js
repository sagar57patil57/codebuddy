const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId, role: decodedToken.role };
    if (req.userData.role === 'admin') {
        next();
    }
    res.status(401).json({ message: "You are not authorised!" });
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
