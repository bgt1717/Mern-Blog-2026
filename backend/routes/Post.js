// routes/Post.js
import express from "express";
import { createPost, getPosts, updatePost, deletePost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const router = express.Router();

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mern-blog",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

// Routes
router.get("/", getPosts);
router.post("/", protect, upload.single("image"), createPost); // <- multer here
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
