const express=require("express")
const { getalljobs, getJobById, createjob, updateJob, deleteJob } = require("../controllers/jobcontroller")
const { isAuthenticated, isAdmin } = require("../middleware/authmiddleware")
const router=express.Router()



router.get("/",getalljobs)
router.get("/:id",getJobById)
router.post("/",isAuthenticated,isAdmin,createjob)
router.put("/:id",isAuthenticated,isAdmin,updateJob)
router.delete("/:id",isAuthenticated,isAdmin,deleteJob)


module.exports=router
