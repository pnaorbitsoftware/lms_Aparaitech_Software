import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Prevent registration using the reserved admin email
    if (email === process.env.ADMIN_EMAIL)
      return res.json({ success: false, message: "This email is reserved." });

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

    // ── Admin login via .env credentials ──────────────────
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      // Upsert the admin user in DB (create if not exists, always ensure role=admin)
      let admin = await User.findOne({ email: adminEmail });
      if (!admin) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        admin = await User.create({
          name: "Admin",
          email: adminEmail,
          password: hashed,
          role: "admin",
        });
      } else if (admin.role !== "admin") {
        admin.role = "admin";
        await admin.save();
      }
      return res.json({
        success: true,
        token: genToken(admin._id),
        user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role, imageUrl: admin.imageUrl },
      });
    }
    // ──────────────────────────────────────────────────────

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.json({ success: false, message: "Invalid credentials" });

    res.json({ success: true, token: genToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, imageUrl: user.imageUrl } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
