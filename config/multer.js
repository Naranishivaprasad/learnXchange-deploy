const multer = require("multer");
const fs = require("fs");

// Auto-create uploads folder if missing
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are supported"), false);
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = { upload };