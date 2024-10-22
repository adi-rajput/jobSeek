import {register,login,logout} from "../controller/Employer_controller.js";
import { isUserAuthenticated } from "../middlewares/is_user_authenticated.js";
import express from "express";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").get(logout);
export default router;