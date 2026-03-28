const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: {
     type: String, required: true, trim: true
     },
  role: {
     type: String, required: true, trim: true
     },
  location: { 
    type: String, required: true, trim: true
 },
  applyLink: { 
    type: String, required: true, trim: true 
},
  skillsRequired: [String],

  jobDescription: {
     type: String, required: true, trim: true
     },
  salary: { 
    type: String, trim: true,default:"10k"
 },
  experience: { 
    type: String, trim: true ,default:"fresher"
},
  jobType: { type: String, enum: ["full-time", "part-time", "internship", "contract"], default: "full-time" },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);