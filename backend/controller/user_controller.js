import User from "../models/user_model.js";
import Job from "../models/Job_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../middlewares/data_uri.js";
import cloudinary from "../middlewares/cloudinary.js";
import Application from "../models/Application_model.js";
import dotenv from "dotenv";
import { sendEmail } from "../utils/email.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const companyDetails = { companyName: company, verified: false };
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    if (role === "Employer") {
      newUser = new User({ name, email, password: hashedPassword, role, companyDetails });
    } else {
      newUser = new User({ name, email, password: hashedPassword, role });
    }
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.status(200).json({ message: "Logged in successfully", success: true, token, user });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    const resetLink = `http://localhost:${process.env.PORT}/auth/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, please ignore this email.</p>`
    };
    await sendEmail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent. Please check your inbox.' });
  } catch (error) {
    console.error('Error in forgotPassword controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    res.status(500).json({ message: 'Invalid or expired token.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const { name, experience, company, address } = req.body;
    const companyDetails = { companyName: company, companyAddress: address, verified: false };
    if (name) user.name = name;
    if (experience) user.experience = experience;
    if (company) user.companyDetails = companyDetails;

    if (req.files && req.files.profilePic) {
      const profilePicFile = getDataUri(req.files.profilePic[0]);
      const cloudResponse = await cloudinary.uploader.upload(profilePicFile);
      user.profilePic = cloudResponse.secure_url;
    }

    if (req.files && req.files.resume) {
      const resumeFile = getDataUri(req.files.resume[0]);
      const cloudResponse = await cloudinary.uploader.upload(resumeFile);
      user.resume = cloudResponse.secure_url;
    }

    if (req.files && req.files.companyLogo) {
      const companyLogo = getDataUri(req.files.companyLogo[0]);
      const cloudResponse = await cloudinary.uploader.upload(companyLogo);
      user.companyDetails.companyLogo = cloudResponse.secure_url;
    }
    
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const approveEmployer = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ message: "Access denied" });
    
    const { employerId } = req.body;
    const employer = await User.findById(employerId);
    if (!employer || employer.role !== "Employer") return res.status(404).json({ message: "Employer not found" });
    
    employer.companyDetails.verified = true;
    await employer.save();
    res.status(200).json({ message: "Employer approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error approving employer" });
  }
};

export const getEmployerJobs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { role, _id: employerId } = req.user;

    if (role !== "Employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const jobs = await Job.find({ employer: employerId });

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await Application.find({ user: userId }).populate("job");
    const appliedJobs = applications.map((app) => app.job);

    return res.status(200).json({ appliedJobs, success: true });
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
