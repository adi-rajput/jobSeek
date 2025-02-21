import Application from "../models/Application_model.js";
import Job from "../models/Job_model.js";
import User from "../models/user_model.js";
import getDataUri from "../middlewares/data_uri.js";
import cloudinary from "../middlewares/cloudinary.js";

export const apply = async (req, res) => {
    try {
        const { answers } = req.body;
        const { id } = req.params;
        const {email,name,phone} = req.body;
        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user.role !== "User") {
            return res.status(403).json({ message: "Only users can apply for jobs" });
        }

        const existingApplication = await Application.findOne({ job: id, user: req.user._id });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const questions = job.jobMetaData;
        if (questions.length > 0) {
            if (!answers || answers.length !== questions.length) {
                return res.status(400).json({ message: "Please answer all questions" });
            }

            for (let i = 0; i < questions.length; i++) {
                if (answers[i]?.question !== questions[i].question) {
                    return res.status(400).json({ message: "Invalid question in answers" });
                }
                if (!answers[i]?.answer || answers[i].answer.trim() === "") {
                    return res.status(400).json({ message: "Answer cannot be empty" });
                }
            }
        }

        let resumeUrl = user.resume;

        if (!resumeUrl) {
            const resume = req.file;
            if (!resume) {
                return res.status(400).json({ message: "Resume is required if not already uploaded" });
            }

            const file = getDataUri(resume);
            const response = await cloudinary.uploader.upload(file.content, {
                resource_type: "raw",
                folder: "resumes",
            });
            resumeUrl = response.secure_url;

            user.resume = resumeUrl;
            await user.save();
        }

        const questionAnswerPairs = job.jobMetaData.map((questionMeta, index) => ({
            question: questionMeta.question,
            answer: answers[index]?.answer || "",
        }));

        const newApplication = new Application({
            name: name,
            email: email,
            phone: phone,
            user: req.user._id,
            job: job._id,
            resume: resumeUrl,
            answers: questionAnswerPairs,
        });

        await newApplication.save();

        job.applicants.push(newApplication._id);
        await job.save();

        user.appliedJobs.push(newApplication._id);
        await user.save();

        return res.status(201).json({
            message: "Application submitted successfully",
            application: newApplication,
            success: true,
        });
    } catch (error) {
        console.error("Error in applying for job:", error);
        return res.status(500).json({ message: "Server error" });
    }
};




export const getApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findById(applicationId).populate("user").populate("job");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        return res.status(200).json({ application, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find().populate("user").populate("job");
        return res.status(200).json({ applications, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["applied", "shortlisted", "rejected", "hired"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const application = await Application.findByIdAndUpdate(id, { status }, { new: true });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        return res.status(200).json({
            message: "Application status updated successfully",
            application,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

