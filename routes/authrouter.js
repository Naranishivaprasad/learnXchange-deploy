const express=require("express")
const { isAuthenticated, } = require("../middleware/authmiddleware")
const { register,login, } = require("../controllers/authcontroller")
const { profile, updateProfile, changePassword, getUserById } = require("../controllers/usercontroller")
const router=express.Router()


router.post("/register",register)
router.post("/login",login)




module.exports = router;