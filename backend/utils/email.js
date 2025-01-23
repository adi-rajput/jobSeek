import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendEmail = async (options) => {
  try {
    // Validate inputs
    if (!options.to) throw new Error('Recipient email is required');
    if (!options.subject) throw new Error('Subject is required');

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL}>`,
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
}

// async function main() {
//   try {
//     await sendEmail({
//       to: "ar9412349716@gmail.com",
//       subject: "Test Email",
//       text: "Hello world?",
//       html: "<b>Hello world?</b>"
//     });
//   } catch (error) {
//     console.error("Main Error:", error.message);
//   }
// }

// main();