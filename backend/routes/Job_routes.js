import {newJob,getJob,updateJobStatus,applicants} from '../controller/Job_controller.js';
import { isUserAuthenticated } from '../middlewares/is_user_authenticated.js';
import express, { application } from 'express';

const router = express.Router();

router.route('/newjob').post(isUserAuthenticated,newJob);
router.route('/:jobId').get(isUserAuthenticated,getJob);
router.route('/:JobId/update').patch(isUserAuthenticated,updateJobStatus);
router.route('/applicants/:jobId').get(isUserAuthenticated,applicants);

export default router;