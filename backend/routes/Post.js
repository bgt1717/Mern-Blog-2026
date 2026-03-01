// routes/Post.js

import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// =============================
// Cloudinary Storage Config
// =============================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mern-blog",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// =============================
// Routes
// =============================

// Get all posts
router.get("/", getPosts);

// Create post (with image upload)
router.post("/", protect, upload.single("image"), createPost);

// Update post (with optional new image)
router.put("/:id", protect, upload.single("image"), updatePost);

// Delete post
router.delete("/:id", protect, deletePost);

export default router;