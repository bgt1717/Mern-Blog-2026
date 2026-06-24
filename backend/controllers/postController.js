import Post from "../models/Post.js";

/*
  IMPORTANT:
  If you are using multer-storage-cloudinary,
  the image is already uploaded to Cloudinary.
  req.file.path === Cloudinary secure_url
*/

export const createPost = async (req, res) => {
  try {
    console.log("REQ.FILE:", req.file);

    const { title, content, category } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content required" });
    }

    // Image is already uploaded by multer
    const imageUrl = req.file ? req.file.path : null;

    const post = await Post.create({
      title,
      content,
      category,
      user: req.user._id,
      image: imageUrl,
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("🔥 CREATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// =========================
// READ ALL POSTS
// =========================
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// UPDATE POST
// =========================
export const updatePost = async (req, res) => {
  console.log("UPDATE REQ.FILE:", req.file);
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update text fields
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

    // If new image uploaded → replace
    if (req.file) {
      post.image = req.file.path; // multer already uploaded to Cloudinary
    }

    const updatedPost = await post.save();
    res.json(updatedPost);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// =========================
// DELETE POST
// =========================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ownership check
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};