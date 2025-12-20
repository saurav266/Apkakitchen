import crypto from "crypto";
import { transporter } from "../config/emailConfig.js";
import {
  Verification_Email_Template,
  WelcomeBack_Email_Template,
  ResendOTP_Email_Template,
  ForgotPassword_Email_Template
} from "../utils/emailTemplate.js";

export const sendVerificationCode = async (email, otp) => {
  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: Verification_Email_Template({ otp }), // ✅ FIXED
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


export const sendResendOtpEmail = async (email, otp, lang = "en") => {
  const trackId = crypto.randomUUID();

  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your New OTP - ApkaKitchen",
    html: ResendOTP_Email_Template({ otp, lang, trackId }),
  });
};


export const sendForgotPasswordEmail = async (email, name, resetUrl) => {
  const trackId = crypto.randomUUID();

  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password - ApkaKitchen",
    html: ForgotPassword_Email_Template({
      name,
      resetUrl,
      trackId,
    }),
  });
};