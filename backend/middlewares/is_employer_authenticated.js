import jwt from 'jsonwebtoken';
import Employer from '../models/Employer_model.js';

export const isEmployerAuthenticated = async (req, res, next) => {
  const token = req.cookies.token; // or use req.headers['authorization'] if using Bearer tokens
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employer = await Employer.findById(decoded.id); // Ensure this line is correct
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    req.employer = employer; // Attach the employer object to req
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
