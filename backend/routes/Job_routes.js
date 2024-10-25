import {newJob,getJob,jobStatus} from '../controller/Job_controller.js';
import { isEmployerAuthenticated } from '../middlewares/is_employer_authenticated.js';
import express from 'express';

const router = express.Router();

router.route('/job').post(isEmployerAuthenticated,newJob);
router.route('/job/:jobId').get(isEmployerAuthenticated,getJob);
router.route('/job/:jobId').post(isEmployerAuthenticated,jobStatus);

export default router;