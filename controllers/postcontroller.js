const Post = require("../models/postmodel"); 
const cloudinary=require("../config/cloudinary.js")
const fs=require("fs")


exports.getallpost = async (req, res) => {
  try {
 
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const totalpost = await Post.countDocuments();

    const posts = await Post
      .find()
      .populate("createdBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      posts,
      totalpost,
      currentPage: Number(page),
      totalPages: Math.ceil(totalpost / limit)
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





// controllers/postcontroller.js — createpost only
exports.createpost = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required",
      });
    }

    let media = { filename: "", fileUrl: "" };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "learnxchange",
        resource_type: "auto",
      });

      media = {
        filename: req.file.originalname,
        fileUrl: result.secure_url,
      };

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Delete error:", err);
      });
    }

    const tagsArray =
      typeof tags === "string"
        ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

    
    const userpost = await Post.create({
      title,
      description,
      category,
      tags: tagsArray,
      media,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Post created successfully",
      userpost,
    });

  } catch (error) {
    console.error("CREATE POST ERROR:", error.message);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};




exports.singlepost = async (req, res) => {
  try {
   
    const post = await Post.findById(req.params.id)
      .populate("createdBy");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });

  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid post ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





exports.updatepost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only the owner can update
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Update text fields only if provided
    if (req.body.title)       post.title       = req.body.title;
    if (req.body.description) post.description = req.body.description;
    if (req.body.category)    post.category    = req.body.category;
    if (req.body.tags)        post.tags        = typeof req.body.tags === "string"
                                                  ? req.body.tags.split(",").map(t => t.trim())
                                                  : req.body.tags;

    // Only update media if a new file was uploaded
    if (req.file) {
      // Delete old image from Cloudinary if one exists
      if (post.media?.fileUrl) {
        try {
          const parts = post.media.fileUrl.split("/");
          const publicId = parts.slice(-2).join("/").split(".")[0]; // "learnxchange/abc123"
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.log("Cloudinary delete error:", err.message);
        }
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "learnxchange",
        resource_type: "auto",
      });

      post.media = {
        filename: req.file.originalname,
        fileUrl: result.secure_url,
      };

      // Delete temp file from uploads folder
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Failed to delete temp file:", err);
      });
    }
    // ← No else here — if no new file, existing post.media stays untouched

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });

  } catch (error) {
    console.error("UPDATE POST ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deletepost = async (req, res) => {
  try {
   
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

   
    const isOwner = post.createdBy.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getuserpost = async (req,res) => {

const { limit } = req.query;

try {

const posts = await Post.find({ createdBy:req.user._id })

.sort({ createdAt:-1 })
.limit(Number(limit) || 3);

res.status(200).json({
success:true,
posts
});

} catch (error) {

res.status(500).json({
message:"Server error",
error:error.message
});

}

};