import Employer from "../models/Employer_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password,  company} = req.body;

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

    const newEmployer = new Employer({ name, email, password: hashedPassword ,company });
    await newEmployer.save();

    res.status(200).json({ message: "Employer registered successfully",
      success: true
     });
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
      name: employer.name,
      email: employer.email,
      profilePic: employer.profilePic,
      company: employer.company,
      companyLogo: employer.companyLogo,
    };

    res.status(200).json({ token, employerData, message: "Login successful" });
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
