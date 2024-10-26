import Application from "../models/Application_model.js";
import Job from "../models/Job_model.js";
import User from "../models/user_model.js";
import getDataUri from "../middlewares/data_uri.js";
import cloudinary from "../middlewares/cloudinary.js";

export const apply = async (req, res) => {
  try {
      const { name, email, phone, answers } = req.body;
      const { id } = req.params;

      const job = await Job.findOne({ JobId: id });
      if (!job) {
          return res.status(400).json({ message: "Job not found" });
      }

      // Debug statement
      console.log(`Checking for existing application for email: ${email} and job ID: ${job._id}`);

      // Check for existing application
      const existingApplication = await Application.findOne({ JobId: id, email });
      //console.log(`Existing application: ${existingApplication}`);
      if (existingApplication) {
          return res.status(400).json({ message: "You have already applied for this job" });
      }

      const user = await User.findById(req.user._id);
      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }

      const resume = req.file;
      let resumeUrl;

      if (resume) {
          const file = getDataUri(resume);
          const response = await cloudinary.uploader.upload(file);
          resumeUrl = response.secure_url;
      }

      if (!resumeUrl) {
          return res.status(400).json({ message: "Resume upload failed" });
      }

      const questionAnswerPairs = job.jobMetaData.map((questionMeta, index) => ({
          question: questionMeta.question,
          answer: answers[index]?.answer || ""
      }));

      const newApplication = new Application({
          name,
          email,
          phone,
          resume: resumeUrl,
          answers: questionAnswerPairs,
          job: job._id,
          user: req.user._id
      });

      await newApplication.save();

      job.applicants.push(newApplication._id);
      await job.save();

      user.appliedJobs.push(newApplication._id);
        await user.save();

      return res.status(200).json({
          message: "Application submitted successfully",
          application: newApplication,
          success: true
      });
  } catch (error) {
    //   console.log(error);
      res.status(500).json({ message: "Server error" });
  }
};

export const getApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findOne({ ApplicationId: applicationId });
        if (!application) {
            return res.status(400).json({ message: "Application not found" });
        }
    
        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.log(error);
    }
    };

export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        return res.status(200).json({ applications, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const validStatuses = ["applied", "shortlisted", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const application = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.status(200).json({
            message: "Application status updated successfully",
            application,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};









