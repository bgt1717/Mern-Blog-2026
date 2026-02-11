import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updatePost } from "../controllers/postController.js";
import {deletePost} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);      // Public
router.post("/", protect, createPost);  // Protected
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id", protect, updatePost);


export default router;
