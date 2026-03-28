const express = require("express");
const { getAllUsers, deleteUser, getAllPosts, deletePost } = require("../controllers/admincontroller");
const { isAuthenticated, isAdmin } = require("../middleware/authmiddleware");
const router = express.Router();


router.get("/users",isAuthenticated,isAdmin, getAllUsers)
router.delete("/users/:id",isAuthenticated,isAdmin,deleteUser)
router.get("/posts",isAuthenticated,isAdmin,getAllPosts)
router.delete("/posts/:id",isAuthenticated,isAdmin,deletePost)




module.exports = router;