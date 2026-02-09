import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser); // ✅ NO ()
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
