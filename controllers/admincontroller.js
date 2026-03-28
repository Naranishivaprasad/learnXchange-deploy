const User = require("../models/usermodel");
const Post = require("../models/postmodel");



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ totalUsers: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ totalPosts: posts.length, posts });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};