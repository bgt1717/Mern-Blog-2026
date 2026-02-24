// routes/Post.js
import express from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mern-blog",           // folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getPosts);
router.post("/", protect, upload.single("image"), createPost); // 🔹 note upload.single("image")
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
