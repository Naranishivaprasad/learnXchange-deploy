const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
     type: String, required: true, trim: true
     },
  content: { 
    type: String, required: true, trim: true 
},
  tags: [String],
  media: {
    filename: { type: String, default:null },
    fileUrl: { type: String ,default:null}
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true  }
}, { timestamps: true });
  
module.exports = mongoose.model("Blog", blogSchema);