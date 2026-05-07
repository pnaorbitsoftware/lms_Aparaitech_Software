import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import connectDB from "./configs/mongodb.js";

// Inline schema to avoid any import issues
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  imageUrl: { type: String, default: "" },
  role: { type: String, enum: ["student", "educator", "admin"], default: "student" },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

await connectDB();

const users = JSON.parse(readFileSync("./seed_users.json", "utf8"));
let created = 0, skipped = 0;

for (const u of users) {
  try {
    const exists = await User.findOne({ email: u.email });
    if (exists) { skipped++; continue; }
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ name: u.name, email: u.email, password: hashed, role: "student" });
    created++;
  } catch (e) {
    console.error("Error seeding", u.email, e.message);
  }
}

console.log(`✅ Seeded ${created} users, skipped ${skipped} existing`);
await mongoose.disconnect();
