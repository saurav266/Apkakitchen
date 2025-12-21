import crypto from "crypto";
import { transporter } from "../config/emailConfig.js";
import {
  Verification_Email_Template,
  WelcomeBack_Email_Template,
  ResendOTP_Email_Template,
  ForgotPassword_Email_Template,
  AssignDeliveryBoyOTP_Email_Template,
  AddDeliveryBoyOTP_Email_Template
} from "../utils/emailTemplate.js";

/* ========= EMAIL VERIFICATION ========= */
export const sendVerificationCode = async (email, otp) => {
  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: Verification_Email_Template({ otp }),
  });
};

/* ========= LOGIN ALERT ========= */
export const sendWelcomeBackEmail = async (email, name) => {
  const trackId = crypto.randomUUID();

  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome Back to ApkaKitchen",
    html: WelcomeBack_Email_Template({
      name,
      ip: "Unknown",
      device: "Unknown",
      trackId
    }),
  });
};

/* ========= RESEND OTP ========= */
export const sendResendOtpEmail = async (email, otp, lang = "en") => {
  const trackId = crypto.randomUUID();

  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your New OTP - ApkaKitchen",
    html: ResendOTP_Email_Template({ otp, lang, trackId }),
  });
};

/* ========= FORGOT PASSWORD ========= */
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

/* ========= ADD DELIVERY BOY OTP ========= */
export const sendAddDeliveryBoyOtpEmail = async ({
  email,
  name,
  otp,
  lang = "en"
}) => {
  const trackId = crypto.randomUUID();

  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Delivery Partner Account",
    html: AddDeliveryBoyOTP_Email_Template({
      name,
      otp,
      lang,
      trackId
    }),
  });
};

/* ========= ASSIGN DELIVERY BOY OTP ========= */
export const sendAssignDeliveryBoyOtpEmail = async ({
  email,
  name,
  otp,
  orderId,
  lang = "en"
}) => {
  const trackId = crypto.randomUUID();

  await transporter.sendMail({
    from: `"ApkaKitchen" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "New Delivery Assigned – OTP Verification",
    html: AssignDeliveryBoyOTP_Email_Template({
      name,
      otp,
      orderId,
      lang,
      trackId
    }),
  });
};
