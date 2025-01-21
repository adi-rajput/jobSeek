import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Function to create a guest user and schedule their deletion
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

    // Schedule deletion 1 minute after creation
    setTimeout(async () => {
      try {
        const result = await User.deleteOne({ _id: guestUser._id });
        console.log(`Deleted guest user with ID: ${guestUser._id}`);
      } catch (error) {
        console.error(`Error deleting guest user with ID: ${guestUser._id}`, error);
      }
    }, 60 * 1000 * 60 * 2); // 1 minute in milliseconds

    // Generate JWT for the guest user
    const token = jwt.sign(
      { id: guestUser._id },
      process.env.JWT_SECRET,
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
