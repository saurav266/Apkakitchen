export const Verification_Email_Template = (otp) => `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#f4f4f4;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;">
    <div style="background:#4CAF50;color:white;padding:20px;text-align:center;font-size:24px;">
      Verify Your Email
    </div>
    <div style="padding:25px;">
      <p>Your OTP code:</p>
      <div style="
        font-size:22px;
        background:#e8f5e9;
        padding:10px;
        border:1px dashed #4CAF50;
        text-align:center;
        font-weight:bold;">
        ${otp}
      </div>
      <p>OTP valid for 10 minutes.</p>
    </div>
    <div style="padding:15px;text-align:center;font-size:12px;">
      © ${new Date().getFullYear()} ApkaKitchen
    </div>
  </div>
</body>
</html>
`;

export const WelcomeBack_Email_Template = (name) => `
<!DOCTYPE html>
<html>
<body style="font-family:Arial;background:#f4f4f4;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;">
    <div style="background:#4CAF50;color:white;padding:20px;text-align:center;font-size:24px;">
      Welcome Back 👋
    </div>
    <div style="padding:25px;color:#333;">
      <p>Hello <strong>${name}</strong>,</p>
      <p>We’re happy to see you again! 🎉</p>
      <p>You have successfully logged in to your account.</p>
      <p>If this wasn’t you, please change your password immediately.</p>
    </div>
    <div style="padding:15px;text-align:center;font-size:12px;color:#777;">
      © ${new Date().getFullYear()} ApkaKitchen
    </div>
  </div>
</body>
</html>
`;

