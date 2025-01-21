import express from "express";
import { guestLogin } from "../guest_user_fnctions/guest.js";
import authMiddleware from "../guest_user_fnctions/guest_middleware.js"; // Import the middleware

const router = express.Router();

router.route("/guestLogin").post(guestLogin);  // No middleware needed for login

// Example: Protecting other routes that need authentication
router.route("/protectedResource")
    .get(authMiddleware, (req, res) => {
        res.status(200).json({ message: "You have access to this resource!" });
    });

export default router;
