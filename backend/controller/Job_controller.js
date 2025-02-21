import Job from '../models/Job_model.js';
import User from '../models/user_model.js';

export const newJob = async (req, res) => {
    try {
        const { title, description, salary, location, jobMetaData, JobId ,company } = req.body;
        if (!title || !description || !location || !JobId || !company) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        const employerId = req.user._id;
        if (  req.user.companyDetails.verified === false) {
            return res.status(403).json({ message: 'Unauthorized: Only employers can post jobs' });
        }

        const jobExist = await Job.findOne({ JobId, employer: employerId });
        if (jobExist) {
            return res.status(400).json({ message: 'Job already exists for this employer' });
        }

        const newJob = new Job({
            JobId,
            title,
            description,
            salary,
            location,
            jobMetaData,
            employer: employerId,
            company: company,
            logo: req.user.companyLogo || "",
        });

        await newJob.save();
        return res.status(200).json({ message: 'Job created successfully', job: newJob, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findOne({ JobId: jobId }).populate('company', 'name email companyLogo');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const updateJobStatus = async (req, res) => {
    try {
        const { JobId } = req.params;
        const { status } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: No user found." });
        }

        const allowedStatuses = ["active", "closed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values: active, closed." });
        }

        console.log(`User ID: ${req.user._id}, Job ID: ${JobId}`);

        const job = await Job.findOneAndUpdate(
            { JobId },
            { status }, 
            { new: true, runValidators: true } 
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        console.log(`Job Employer ID: ${job.employer}`);

        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to update this job." });
        }

        return res.status(200).json({ message: `Job status updated to ${status}.`, job, success: true });
    } catch (error) {
        console.error("Error updating job status:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const applicants = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findOne({ JobId: jobId, employer: req.user._id }).populate('applicants.user', 'name email resume');
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        return res.status(200).json({ applicants: job.applicants, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
