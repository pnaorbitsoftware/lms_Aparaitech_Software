import jwt from "jsonwebtoken";
import User from "../models/User.js";

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.json({ success: true, token: genToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, token: genToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
