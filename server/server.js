import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";
import userRouter from "./routes/userRoutes.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoute.js";
import razorpayRoute from "./routes/razorpayRoute.js";
import authRouter from "./routes/authRoutes.js";
import { protect, protectEducator } from "./middlewares/authMiddleware.js";

const app = express();
await connectDB();
await connectCloudinary();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "https://www.aparaitech.org", "https://aparaitech.org", "https://lms-full-stack-tan.vercel.app"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || process.env.NODE_ENV !== "production") return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.sendStatus(200);
});

app.get("/", (req, res) => res.send("API Working ✅"));
app.use("/api/auth", express.json(), authRouter);
app.use("/api/educator", express.json(), protectEducator, educatorRouter);
app.use("/api/user", express.json(), protect, userRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/razorpay", express.json(), razorpayRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
