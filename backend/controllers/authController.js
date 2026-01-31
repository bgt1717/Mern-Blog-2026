import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    console.log("🔥 HIT REGISTER ROUTE");
    console.log("📦 BODY:", req.body);
    console.log("🔑 ENV JWT:", process.env.JWT_SECRET ? "YES" : "NO");

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userExists = await User.findOne({ email });
    console.log("👤 USER EXISTS:", userExists);

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    console.log("✅ USER CREATED:", user._id);

    res.status(201).json({
      message: "REGISTER SUCCESS"
    });

} catch (error) {
  console.error("🔥 FULL REGISTER ERROR ↓↓↓");
  console.error(error);
  console.error("🔥 END ERROR ↑↑↑");
  res.status(500).json({ message: error.message });
}

};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

