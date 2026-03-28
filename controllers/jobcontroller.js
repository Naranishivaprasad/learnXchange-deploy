const Job=require("../models/jobmodel")


exports.createjob=async(req,res)=>{
    try {
        const {company,role,location,applyLink,jobDescription}=req.body
        console.log(company,role,location,applyLink,jobDescription)
         if (!company || !role || !location || !applyLink || !jobDescription) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
        const jobdata=await Job.create({company,role,location,applyLink,jobDescription,createdBy: req.user.id})

        res.status(201).json({ message: "Job created successfully", jobdata});


    } catch (error) {
         res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.getalljobs=async(req,res)=>{
        try {
            const {page=1,limit=10}=req.query

            const skip = (page - 1) * limit;
            const totalJobs = await Job.countDocuments();

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      jobs,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit)
    });

        } catch (error) {
             res.status(500).json({ message: "Server error", error: error.message });
        }
}




exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ job });

  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    job.company        = req.body.company        || job.company;
    job.role           = req.body.role           || job.role;
    job.location       = req.body.location       || job.location;
    job.applyLink      = req.body.applyLink      || job.applyLink;
    job.skillsRequired = req.body.skillsRequired || job.skillsRequired;
    job.jobDescription = req.body.jobDescription || job.jobDescription;
    job.salary         = req.body.salary         || job.salary;
    job.experience     = req.body.experience     || job.experience;
    job.jobType        = req.body.jobType        || job.jobType;

    await job.save();

    res.status(200).json({ message: "Job updated successfully", job });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};