import express from 'express';
import upload from '../middlewares/multer.js'; // Adjust this import
import { isEmployerAuthenticated } from '../middlewares/is_employer_authenticated.js';
import { register,login,logout,getProfile,updateProfile,getMyJobs } from '../controller/Employer_controller.js';
import { sendEmail } from '../utils/email.js';
const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").get(logout);
router.route("/profile/:id").get(isEmployerAuthenticated,getProfile);
router.route("/profile/edit").post(isEmployerAuthenticated, upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 }
]), updateProfile);
router.route("/getJobs").get(isEmployerAuthenticated,getMyJobs);
router.post("/emailNotice", isEmployerAuthenticated, async (req, res) => {
  try {
    
    const { to, subject, text, html } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Recipient email (to) is required" });
    }
    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    // Call sendEmail
    const result = await sendEmail({
      to,
      subject,
      text,
      html,
    });

    res.status(200).json({
      message: "Email sent successfully",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});
export default router;

