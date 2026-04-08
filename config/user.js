// config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("connecting to database.......");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
  }
};

module.exports = connectDB;