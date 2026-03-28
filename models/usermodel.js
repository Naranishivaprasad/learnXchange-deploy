const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
     type: String, required: true, trim: true 
    },
  email: { 
    type: String, required: true, trim: true, unique: true 
  },
  password: {
     type: String, required: true 
    },
  role: {
     type: String, enum: ["user", "admin"], default: "user"
     },
  profile: {
    skills: [String],
    aboutMe: { type: String, default:null },
    profile_name: { type: String, default:null },
    profile_url: {
       type: String, default:null }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);