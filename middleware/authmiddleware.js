const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

exports.isAuthenticated = async (req, res, next) => {
  try {
  
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id)

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.isAdmin = (req, res, next) => {
   
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admins only" });
  }
  next();
};