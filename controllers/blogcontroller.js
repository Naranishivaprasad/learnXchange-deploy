const Blog = require("../models/blogmodel");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

// ================= CREATE BLOG =================
exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    let media = {
      filename: "",
      fileUrl: "",
    };

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

    const blog = await Blog.create({
      title,
      content,
      tags: typeof tags === "string"
        ? tags.split(",").map(tag => tag.trim())
        : [],
      media,
      createdBy: req.user._id, 
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.error("CREATE BLOG ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ================= GET ALL BLOGS =================
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.find()
      .populate("createdBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      blogs,
      totalBlogs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBlogs / limit),
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ================= GET SINGLE BLOG =================
exports.getsingleblog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ blog });

  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ================= UPDATE BLOG =================
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;

    blog.tags = req.body.tags
      ? req.body.tags.split(",").map(tag => tag.trim())
      : blog.tags;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "learnxchange",
        resource_type: "auto",
      });

      blog.media = {
        filename: req.file.originalname,
        fileUrl: result.secure_url,
      };

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Delete error:", err);
      });
    }

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });

  } catch (error) {
    console.error("UPDATE BLOG ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



// ================= DELETE BLOG =================
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};