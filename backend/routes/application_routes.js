import express from 'express';
import { apply, getApplication, getAllApplications, changeStatus } from '../controller/Apply_controller.js'; 
import { isUserAuthenticated } from '../middlewares/is_user_authenticated.js'; 
import upload from '../middlewares/multer.js'; 

const router = express.Router();

router.route("/apply/:id")
  .post(isUserAuthenticated, upload.single('resume'), apply);

router.route("/application/:applicationId")
  .get(isUserAuthenticated, getApplication);

router.route("/applications/all")
  .get(isUserAuthenticated, getAllApplications);

router.route("/status/:id")
  .put(isUserAuthenticated, changeStatus);

export default router;
