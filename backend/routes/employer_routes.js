import express from 'express';
import upload from '../middlewares/multer.js'; // Adjust this import
import { isEmployerAuthenticated } from '../middlewares/is_employer_authenticated.js';
import { register,login,logout,getProfile,updateProfile } from '../controller/Employer_controller.js';

const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").get(logout);
router.route("/profile/:id").get(isEmployerAuthenticated,getProfile);
router.route("/profile/edit").post(isEmployerAuthenticated, upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 }
]), updateProfile);

export default router;

