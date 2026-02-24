import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testUpload = async () => {
  try {
    const result = await cloudinary.v2.uploader.upload(
      path.resolve("./test-image.jpg") // Put a test image here
    );
    console.log("✅ Upload successful!");
    console.log(result); // This includes url, public_id, etc.
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
};

testUpload();
