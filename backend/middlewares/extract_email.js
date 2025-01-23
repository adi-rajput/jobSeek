// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// const secretKey = process.env.JWT_SECRET;

// // Function to generate a token
// export const generateToken = (user) => {
//   // Ensure the user object contains the email field
//   const payload = {
//     id: user.id,
//     email: user.email, // Include email explicitly
//     role: user.role || "user", // Optional: other fields
//   };

//   return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Token valid for 1 hour
// };

// // Middleware to extract and verify the token
// export const verifyLoggedInUser = (req, res, next) => {
//     try {
//       if (!req.cookies || !req.cookies.token) {
//         return res.status(401).json({ success: false, error: "Token not found in cookies" });
//       }
  
//       const token = req.cookies.token;
//       const decoded = jwt.verify(token, secretKey);
  
//       if (!decoded.email) {
//         return res.status(400).json({ success: false, error: "Email not found in token" });
//       }
  
//       req.email = decoded.email; // Attach email to the request object
//       next();
//     } catch (error) {
//       console.error("Error verifying token:", error.message);
//       res.status(401).json({ success: false, error: "Invalid or expired token" });
//     }
//   };
  
