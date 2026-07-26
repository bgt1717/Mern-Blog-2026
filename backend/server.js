import dotenv from "dotenv";
dotenv.config();  // MUST BE FIRST LINE

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/Post.js";

connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://townsendblog.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests like Postman/server-side requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes); // ✅ NO ()

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Cloudinary key:", process.env.CLOUDINARY_API_KEY);

