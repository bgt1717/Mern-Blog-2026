import express from "express";
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

// Public registration is disabled.
router.post("/register", (req, res) => {
  return res.status(403).json({
    message: "Public registration is disabled."
  });
});

// Existing users can still log in.
router.post("/login", loginUser);

router.get("/test", (req, res) => {
  res.json({ message: "Auth router is working" });
});

router.get("/protected", (req, res) => {
  res.json({
    message: "You are authenticated",
    authHeader: req.headers.authorization,
  });
});

export default router;
