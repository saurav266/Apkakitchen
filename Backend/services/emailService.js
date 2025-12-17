import { transporter } from "../config/emailConfig.js";
import {
  Verification_Email_Template,
  WelcomeBack_Email_Template,
} from "../utils/emailTemplate.js";

export const sendVerificationCode = async (email, otp) => {
  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: Verification_Email_Template(otp),
  });
};

export const sendWelcomeBackEmail = async (email, name) => {
  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome Back to ApkaKitchen",
    html: WelcomeBack_Email_Template(name),
  });
};
