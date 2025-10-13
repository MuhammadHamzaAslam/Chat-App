import env from "./env.js";
import nodemailer from "nodemailer";

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});
export const sendEmailOTP = (email, otp) => {
  gmailTransporter.sendMail({
    from: env.EMAIL_USERNAME,
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP for email verification is: ${otp}. It is valid for 3 minutes.`,
  });
};
