const  express=require("express")
const { getAllBlogs, getsingleblog, createBlog, updateBlog, deleteBlog } = require("../controllers/blogcontroller")
const { isAuthenticated, isAdmin } = require("../middleware/authmiddleware")
const { upload } = require("../config/multer")
const router=express.Router()


router.get("/",getAllBlogs)
router.get("/:id",isAuthenticated,getsingleblog)
router.post("/",isAuthenticated,isAdmin,upload.single("image"),createBlog)
router.put("/:id",isAuthenticated,isAdmin,upload.single("image"),updateBlog)
router.delete("/:id",isAuthenticated,isAdmin,deleteBlog)


module.exports=router