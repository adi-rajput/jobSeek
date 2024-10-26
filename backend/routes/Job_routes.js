import {newJob,getJob,jobStatus,applicants} from '../controller/Job_controller.js';
import { isEmployerAuthenticated } from '../middlewares/is_employer_authenticated.js';
import express, { application } from 'express';

const router = express.Router();

router.route('/job').post(isEmployerAuthenticated,newJob);
router.route('/job/:jobId').get(isEmployerAuthenticated,getJob);
router.route('/job/:jobId').post(isEmployerAuthenticated,jobStatus);
router.route('/job/:jobId/applicants').get(isEmployerAuthenticated,applicants);

export default router;