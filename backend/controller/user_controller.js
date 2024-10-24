import User from "../models/user_model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import upload from "../middlewares/multer.js";
import getDataUri from "../middlewares/data_uri.js";
import cloudinary from "../middlewares/cloudinary.js";

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res
      .status(200)
      .json({
        message: "User registered successfully",
        success: true,
        newUser,
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
      resume: user.resume,
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
        userData,
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

export const getUser = async (req, res) => {
  try {
    const ID = req.params.id;
    const user = await User.findById(ID).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { experience } = req.body;
    const profilePic = req.files.profilePic ? req.files.profilePic[0] : null;
    const resume = req.files.resume ? req.files.resume[0] : null;

    let cloudResponse;
    if (profilePic) {
      const file = getDataUri(profilePic);
      cloudResponse = await cloudinary.uploader.upload(file);
    }

    let cloudResponse2;
    if (resume) {
      const file2 = getDataUri(resume);
      cloudResponse2 = await cloudinary.uploader.upload(file2,{
        format: "pdf",
        transformation: {
          width: 400,
          Height: 600,
          crop: "limit"}
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (experience) {
      user.experience = experience;
    } 
    if (profilePic && cloudResponse) {
      user.profilePic = cloudResponse.secure_url;
    }
    if (resume && cloudResponse2) {
      user.resume = cloudResponse2.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while updating the profile" });
  }
};
