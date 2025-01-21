import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user_model.js";
import cron from "node-cron";

export const guestLogin = async (req, res) => {
    try {
        const guestEmail = `guest_${Date.now()}@guest.com`;

        // Use a default password for all guest users (hashed)
        const hashedPassword = await bcrypt.hash("guest_password", 10);

        // Create a new user entry for the guest
        const guestUser = new User({
            name: "Guest User",
            email: guestEmail,
            password: hashedPassword,
        });

        await guestUser.save();

        // Generate JWT for the guest user
        const token = jwt.sign(
            { id: guestUser._id },
            "your_secret_key",
            { expiresIn: "1h" } // Adjust expiration as needed
        );

        res.status(200).json({
            message: "Guest login successful",
            user: { id: guestUser._id, name: guestUser.name, email: guestUser.email },
            token,
        });
    } catch (error) {
        console.error("Error during guest login:", error);
        res.status(500).json({ message: "Error during guest login" });
    }
};

// Clean up expired guest users every hour
cron.schedule("0 * * * *", async () => {
    try {
        const result = await User.deleteMany({ 
            email: { $regex: /^guest_/ }, 
            createdAt: { $lte: new Date(Date.now() - 3600 * 1000) } // Older than 1 hour
        });
        console.log(`Deleted ${result.deletedCount} expired guest users.`);
    } catch (error) {
        console.error("Error cleaning up guest users:", error);
    }
});
