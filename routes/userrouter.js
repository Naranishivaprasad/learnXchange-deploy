const express=require("express")
const { isAuthenticated, } = require("../middleware/authmiddleware")

const { profile, updateProfile, changePassword, getUserById } = require("../controllers/usercontroller")
const router=express.Router()
const { upload } = require("../config/multer")



router.get("/profile",isAuthenticated,profile)
router.put("/updateprofile",isAuthenticated,upload.single("image"),updateProfile)
router.put("/passwordupdate",isAuthenticated,changePassword)
router.get("/:id",isAuthenticated,getUserById)


module.exports = router;