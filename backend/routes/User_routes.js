import {register,login,logout,getUser,updateProfile} from "../controller/user_controller.js";
import { isUserAuthenticated } from "../middlewares/is_user_authenticated.js";
import express from "express";
import upload from "../middlewares/multer.js";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").get(logout);
router.route("/profile/:id").get(isUserAuthenticated,getUser);
router.route("/profile/edit").post(isUserAuthenticated,upload.fields([{name:"profilePic",maxCount:1},{name:"resume",maxCount:1}]),updateProfile);
export default router;