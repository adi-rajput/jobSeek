import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import { profile } from "console";
import jwt from "jsonwebtoken";

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

    res.status(200).json({ message: "User registered successfully" ,
    success: true,
    newUser
    });
  } catch (error) {
    console.log("Error in register: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({message: "Please enter all fields"});
    }
    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters long"});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message: "User does not exist"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
    
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
      expiresIn: "7d"
    });
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePic: user.profilePic,
      resume: user.resume,
    }

    res.status(200).json({token, userData, message: "Login successful"});
  } catch (error) {
    console.log("Error in login: ", error);
  }
};

export const logout = async (req, res) => { 
  try {
    res.clearCookie("token");
    return res.status(200).json({message: "Logged out"});
  } catch (error) {
    console.log("Error in logout: ", error);
  }
};  