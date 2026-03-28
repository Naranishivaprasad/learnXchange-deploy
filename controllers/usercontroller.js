const User = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");


exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { skills, aboutMe } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    if (!user.profile) {
      user.profile = {};
    }

    let profile = {
      profile_name: "",
      profile_url: "",
    };

 
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "learnxchange",
        resource_type: "auto",
      });

      profile = {
        profile_name: req.file.originalname,
        profile_url: result.secure_url,
      };

     
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.log("Failed to delete temp file:", err);
        } else {
          console.log("Temp file deleted:", req.file.path);
        }
      });
    }

   
    user.profile.skills = skills
      ? skills.split(",").map((s) => s.trim())
      : user.profile.skills;

    user.profile.aboutMe = aboutMe || user.profile.aboutMe;
    user.profile.profile_name =
      profile.profile_name || user.profile.profile_name;
    user.profile.profile_url =
      profile.profile_url || user.profile.profile_url;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error); 
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= CHANGE PASSWORD =================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect" });
    }

   
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "New password cannot be same as current password",
      });
    }

    
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= GET USER BY ID =================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};