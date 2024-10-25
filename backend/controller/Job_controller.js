import Job from '../models/Job_model.js';
import Employer from '../models/Employer_model.js';

export const newJob = async(req, res) => {
    try {
        const { title, description, salary, location, jobMetaData ,JobId} = req.body;
        if(!title || !description || !location ||  !JobId){
            return res.status(400).json({message: 'Please fill all fields'});
        }
        const employerId = req.employer._id;
        const employer  = await Employer.findById(employerId);
        if(!employer){
            return res.status(400).json({message: 'Employer not found'});
        }
        const newJob = new Job({
            JobId,
            title,
            description,
            salary,
            location,
            jobMetaData,
            company: employerId,
        });
        await newJob.save();
        employer.jobs.push(newJob._id);
        await employer.save();
        return res.status(200).json({message: 'Job created successfully', job: newJob,success: true});

    } catch (error) {
        console.log(error);
    }
}

export const getJob = async(req, res) => {
    try {
        const {jobId} = req.params;
        const job = await  Job.findOne({JobId: jobId});
        if(!job){
            return res.status(400).json({message:    'Job not found'});
        }   
        return res.status(200).json({job, success: true});
    }
    catch (error) {
        console.log(error);
    }
}

export const jobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;  // jobId here refers to the unique job identifier, not MongoDB's _id
        const { status } = req.body;

        // Check if status is a boolean
        if (typeof status !== 'boolean') {
            return res.status(400).json({ message: 'Invalid status value. It should be a boolean.' });
        }

        // Find and update the job by custom jobId field
        const job = await Job.findOneAndUpdate({ JobId: jobId }, { status }, { new: true });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Error updating job status:", error.message || error);
        return res.status(500).json({ message: 'Server error' });
    }
};
