import express from 'express';
import { apply,getApplication,changeStatus,getAllApplications } from "../controller/Apply_controller.js";
import { isUserAuthenticated } from "../middlewares/is_user_authenticated.js";
import { isEmployerAuthenticated } from "../middlewares/is_employer_authenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/apply/:id").post(isUserAuthenticated, upload.single('resume'), apply);
router.route("/application/:id").get(isUserAuthenticated, getApplication);
router.route("/applications/all").get(isEmployerAuthenticated, getAllApplications);
router.route("/status/:id").put(isEmployerAuthenticated, changeStatus);
export default router;
