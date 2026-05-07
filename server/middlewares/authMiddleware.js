import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = { id: user._id, email: user.email, role: user.role };
    req.auth = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const protectEducator = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || (user.role !== "educator" && user.role !== "admin"))
      return res.status(403).json({ success: false, message: "Educators only" });

    req.user = { id: user._id, email: user.email, role: user.role };
    req.auth = { userId: user._id };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const isEducator = (req, res, next) => {
  if (!req.user || (req.user.role !== "educator" && req.user.role !== "admin"))
    return res.status(403).json({ success: false, message: "Educators only" });
  next();
};
