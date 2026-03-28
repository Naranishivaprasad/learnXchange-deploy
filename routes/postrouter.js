const express=require("express")
const { getallpost, singlepost, createpost, updatepost, deletepost, getuserpost } = require("../controllers/postcontroller")
const { isAuthenticated, isAdmin } = require("../middleware/authmiddleware")
const { upload } = require("../config/multer")
const router=express.Router()


router.get("/",getallpost)
router.get("/user",isAuthenticated,getuserpost)
router.get("/:id",singlepost)
router.post("/", isAuthenticated, upload.single("image"), createpost)
router.put("/:id", isAuthenticated, upload.single("image"), updatepost)
router.delete("/:id",isAuthenticated,deletepost)








module.exports = router;