import Job from '../models/Job_model.js';
import User from '../models/user_model.js';

// Create a new job (Employer only)
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

        // Check for existing job with the same JobId for the specific employer
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
            company: company, // Reference to employer user
            logo: req.user.companyLogo || "",
        });

        await newJob.save();
        return res.status(200).json({ message: 'Job created successfully', job: newJob, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get a job by JobId
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

// Update job status (Employer only)
export const updateJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status } = req.body;

        // Validate status value
        const validStatuses = ["active", "closed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Allowed values: active, closed.' });
        }

        // Update job status if it belongs to the logged-in employer
        const job = await Job.findOneAndUpdate(
            { _id: jobId, employer: req.user._id }, 
            { status }, 
            { new: true }
        );

        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }

        return res.status(200).json({ message: `Job status updated to ${status}.`, job, success: true });
    } catch (error) {
        console.error("Error updating job status:", error.message || error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get all applicants for a job (Employer only)
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
