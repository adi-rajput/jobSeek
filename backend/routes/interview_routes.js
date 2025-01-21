import express from 'express';
import { scheduleInterview } from '../controller/interview_controller.js';

const router = express.Router();

// Change this to match your API endpoint
router.post('/scheduleInterview', scheduleInterview);  // Changed from '/schedule'

export default router;