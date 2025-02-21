import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile, 
  //createJob, 
  approveEmployer, 
  getEmployerJobs, 
  getUserAppliedJobs 
} from "../controller/user_controller.js";
import { isUserAuthenticated } from "../middlewares/is_user_authenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").get(logout);
router.route("/profile").get(isUserAuthenticated, getProfile);
router.route("/profile/edit").post(
  isUserAuthenticated,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);
//router.route("/createJob").post(isUserAuthenticated, createJob);
router.route("/admin/approveEmployer").post(isUserAuthenticated, approveEmployer);
router.route("/employer/jobs").get(isUserAuthenticated, getEmployerJobs);
router.route("/appliedJobs").get(isUserAuthenticated, getUserAppliedJobs);

export default router;
