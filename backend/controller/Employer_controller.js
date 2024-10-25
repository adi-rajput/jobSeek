import Employer from "../models/Employer_model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import upload from "../middlewares/multer.js";
import getDataUri from "../middlewares/data_uri.js";
import cloudinary from "../middlewares/cloudinary.js";
import Job from "../models/Job_model.js";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ message: "Employer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployer = new Employer({ name, email, password: hashedPassword });
    await newEmployer.save();

    res
      .status(200)
      .json({ message: "Employer registered successfully", success: true });
  } catch (error) {
    console.log("Error in register: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ message: "Employer does not exist" });
    }
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: employer._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const employerData = {
      id: employer._id,
      name: employer.name,
      email: employer.email,
      profilePic: employer.profilePic,
      company: employer.company,
      companyLogo: employer.companyLogo,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Logged in successfully",
        success: true,
        token,
        employerData,
      });
  } catch (error) {
    console.log("Error in login: ", error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.log("Error in logout: ", error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const ID = req.params.id;
    const employer = await Employer.findById(ID).select("-password");
    if (!employer) {
      return res
        .status(404)
        .json({ success: false, message: "Employer not found" });
    }
    return res.status(200).json({
      employer,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.employer) {
      return res.status(401).json({ message: "Employer not authenticated" });
    }

    const employerId = req.employer._id;
    const { company } = req.body;
    const profilePic = req.files?.profilePic?.[0];
    const companyLogo = req.files?.companyLogo?.[0];

    let cloudResponse;
    if (profilePic) {
      const file = getDataUri(profilePic);
      cloudResponse = await cloudinary.uploader.upload(file);
    }

    let cloudResponse2;
    if (companyLogo) {
      const Logo = getDataUri(companyLogo);
      cloudResponse2 = await cloudinary.uploader.upload(Logo);
    }

    const employer = await Employer.findById(employerId);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    if (company) {
      employer.company = company;
    }
    if (profilePic && cloudResponse) {
      employer.profilePic = cloudResponse.secure_url;
    }
    if (companyLogo && cloudResponse2) {
      employer.companyLogo = cloudResponse2.secure_url;
    }

    await employer.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      employer,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
};

export const getJobs = async (req, res) => {
  try {
    // Ensure employer is authenticated
    if (!req.employer || !req.employer._id) {
      return res.status(400).json({ message: "Invalid employer" });
    }

    // Fetch the employer document
    const employer = await Employer.findById(req.employer._id).populate('jobs');
    
    // Check if employer exists
    if (!employer) {
      return res.status(404).json({ message: "Employer not found", success: false });
    }

    // Return the jobs array from the employer document
    const jobs = employer.jobs; // This will contain the populated Job documents

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this employer", success: false });
    }

    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
