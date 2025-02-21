import express from 'express';
import { apply, getApplication, changeStatus , getApplicationsByJob } from '../controller/Apply_controller.js'; 
import { isUserAuthenticated } from '../middlewares/is_user_authenticated.js'; 
import upload from '../middlewares/multer.js'; 

const router = express.Router();

router.route("/apply/:id")
  .post(isUserAuthenticated, upload.single('resume'), apply);

router.route("/:applicationId")
  .get(isUserAuthenticated, getApplication);

router.route("/status/:id")
  .put(isUserAuthenticated, changeStatus);

  router.route("/applicants/:id")
  .get(isUserAuthenticated, getApplicationsByJob);
export default router;
