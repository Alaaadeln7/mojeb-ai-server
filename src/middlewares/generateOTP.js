import nodemailer from "nodemailer";
import { config } from "dotenv";
config();
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationEmail = async (email, otpCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.PROJECT_NAME}`,
    to: email,
    subject: `Email Verification from  ${process.env.PROJECT_NAME} - Your One-Time Password`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #2c3e50; margin-bottom: 5px;">Email Verification</h2>
            <p style="color: #7f8c8d;">Please use the following OTP to verify your email</p>
          </div>
          
          <div style="background-color: #ffffff; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0; border: 1px dashed #bdc3c7;">
            <p style="font-size: 14px; margin-bottom: 10px;">Your verification code is:</p>
            <div style="font-size: 40px; font-weight: bold; letter-spacing: 2px; color: #000; margin: 15px 0;">
              ${otpCode}
            </div>
            <p style="font-size: 12px; color: #e74c3c;">This code will expire in 5 minutes</p>
          </div>
          
          <p style="font-size: 14px; line-height: 1.6;">
            If you didn't request this email, please ignore it. For security reasons, don't share this code with anyone.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; text-align: center;">
            <p style="font-size: 12px; color: #95a5a6;">
              © ${new Date().getFullYear()} mojeeb-ai. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
