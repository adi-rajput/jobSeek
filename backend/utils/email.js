import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//import { getLoggedInUserEmail } from '../middlewares/extract_email.js';

export const sendEmail = async (options) => {
  try {
    // Validate inputs
    if (!options.to) throw new Error('Recipient email is required');
    if (!options.subject) throw new Error('Subject is required');
    if (!options.from) throw new Error('Sender email is required');
    // Extract the email from middleware (getLoggedInUserEmail)
   // const loggedInUserEmail = await getLoggedInUserEmail();  // Using the middleware to fetch the email

    //if (!loggedInUserEmail) throw new Error('Logged-in user email is missing');

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL}>`,  // Use the extracted email from middleware
      to: options.to,
      subject: options.subject,
      text: options.text || 'No text content',
      html: options.html || '<p>No HTML content</p>'
    };

    console.log('Sending email to:', options.to);
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    return { messageId: info.messageId };
  } catch (error) {
    console.error("Detailed Email Error:", error);
    throw error;
  }
};
