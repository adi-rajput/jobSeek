import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';

export const isUserAuthenticated = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; 
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
