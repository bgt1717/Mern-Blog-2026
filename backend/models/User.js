import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Please add a username"] },
    email: { type: String, required: [true, "Please add an email"], unique: true },
    password: { type: String, required: [true, "Please add a password"] },
  },
  { timestamps: true }
);

// ✅ Correct pre-save hook
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next(); // only hash new/changed passwords
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // call next after hashing
  } catch (error) {
    next(error); // pass error to mongoose
  }
});

const User = mongoose.model("User", userSchema);
export default User;
