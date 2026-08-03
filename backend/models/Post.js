import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "AI",
        "Projects",
        "Career",
        "Personal",
        "Technology",
        "News",
        "Other"
      ],
      default: "Other",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);