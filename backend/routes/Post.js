import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPosts);      // Public
router.post("/", protect, createPost);  // Protected
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);


export default router;
