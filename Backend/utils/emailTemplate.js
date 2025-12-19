/* ========= HELPERS ========= */
const brandFooter = () =>
  `© ${new Date().getFullYear()} ApkaKitchen • Secure & Trusted`;

const trackingPixel = (id) =>
  `<img src="${process.env.APP_URL}/email/open/${id}" width="1" height="1" style="display:none;" />`;

/* ========= OTP EMAIL ========= */
export const Verification_Email_Template = ({
  otp,
  lang = "en",
  trackId,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
@media (prefers-color-scheme: dark) {
  body { background:#121212 !important; color:#fff !important; }
  .card { background:#1e1e1e !important; }
}
</style>
</head>

<body style="margin:0;padding:0;background:#f2f4f6;font-family:Segoe UI,Arial;">
<table width="100%">
<tr>
<td align="center" style="padding:25px">

<table width="600" class="card"
style="background:#ffffff;border-radius:12px;
box-shadow:0 8px 25px rgba(0,0,0,.08);">

<tr>
<td style="background:linear-gradient(135deg,#4CAF50,#2e7d32);
padding:28px;text-align:center;color:#fff">
<h2 style="margin:0">
${lang === "hi" ? "ईमेल सत्यापन" : "Verify Your Email"}
</h2>
<p style="opacity:.9;font-size:14px">
${lang === "hi"
  ? "ApkaKitchen खाता सुरक्षित करें"
  : "Secure your ApkaKitchen account"}
</p>
</td>
</tr>

<tr>
<td style="padding:30px;font-size:15px">
<p>
${lang === "hi"
  ? "आपका OTP कोड नीचे दिया गया है:"
  : "Your verification code is:"}
</p>

<div style="
margin:30px auto;
width:220px;
background:#e8f5e9;
border:2px dashed #4CAF50;
text-align:center;
font-size:28px;
letter-spacing:6px;
font-weight:bold;
color:#2e7d32;
padding:14px;
border-radius:8px;">
${otp}
</div>

<p style="font-size:13px;color:#555">
⏱ ${lang === "hi"
  ? "OTP 10 मिनट के लिए मान्य है"
  : "OTP valid for 10 minutes"}
</p>

<div style="
margin-top:18px;
background:#fff8e1;
border-left:4px solid #ffb300;
padding:12px;font-size:13px;">
⚠ ${lang === "hi"
  ? "यदि आपने अनुरोध नहीं किया है तो इसे अनदेखा करें"
  : "If you didn’t request this, please ignore"}
</div>
</td>
</tr>

<tr>
<td style="background:#f7f9fb;padding:15px;
text-align:center;font-size:12px;color:#888">
${brandFooter()}
</td>
</tr>

</table>

${trackingPixel(trackId)}

</td>
</tr>
</table>
</body>
</html>
`;

/* ========= WELCOME BACK EMAIL ========= */
export const WelcomeBack_Email_Template = ({
  name,
  ip,
  device,
  trackId,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
@media (prefers-color-scheme: dark) {
  body { background:#121212 !important; color:#fff !important; }
  .card { background:#1e1e1e !important; }
}
</style>
</head>

<body style="margin:0;padding:0;background:#f2f4f6;font-family:Segoe UI,Arial;">
<table width="100%">
<tr>
<td align="center" style="padding:25px">

<table width="600" class="card"
style="background:#ffffff;border-radius:12px;
box-shadow:0 8px 25px rgba(0,0,0,.08);">

<tr>
<td style="background:linear-gradient(135deg,#1976d2,#0d47a1);
padding:28px;text-align:center;color:#fff">
<h2 style="margin:0">Welcome Back 👋</h2>
<p style="opacity:.9;font-size:14px">Login notification</p>
</td>
</tr>

<tr>
<td style="padding:30px;font-size:15px">
<p>Hello <strong>${name}</strong>,</p>

<p>You have successfully logged in to your ApkaKitchen account.</p>

<div style="
background:#e3f2fd;
padding:12px;
border-left:4px solid #1976d2;
font-size:13px;margin:18px 0;">
<strong>Login Details</strong><br/>
Device: ${device}<br/>
IP Address: ${ip}
</div>

<div style="
background:#fdecea;
border-left:4px solid #d32f2f;
padding:12px;
font-size:13px;">
🔒 If this wasn’t you, please reset your password immediately.
</div>
</td>
</tr>

<tr>
<td style="background:#f7f9fb;padding:15px;
text-align:center;font-size:12px;color:#888">
${brandFooter()}
</td>
</tr>

</table>

${trackingPixel(trackId)}

</td>
</tr>
</table>
</body>
</html>
`;


/* ========= RESEND OTP EMAIL ========= */
export const ResendOTP_Email_Template = ({
  otp,
  lang = "en",
  trackId,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
@media (prefers-color-scheme: dark) {
  body { background:#121212 !important; color:#fff !important; }
  .card { background:#1e1e1e !important; }
}
</style>
</head>

<body style="margin:0;padding:0;background:#f2f4f6;font-family:Segoe UI,Arial;">
<table width="100%">
<tr>
<td align="center" style="padding:25px">

<table width="600" class="card"
style="background:#ffffff;border-radius:12px;
box-shadow:0 8px 25px rgba(0,0,0,.08);">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#ff9800,#ef6c00);
padding:28px;text-align:center;color:#fff">
<h2 style="margin:0">
${lang === "hi" ? "नया OTP भेजा गया" : "New OTP Sent"}
</h2>
<p style="opacity:.9;font-size:14px">
${lang === "hi"
  ? "आपका नया सत्यापन कोड"
  : "Your new verification code"}
</p>
</td>
</tr>

<!-- CONTENT -->
<tr>
<td style="padding:30px;font-size:15px">
<p>
${lang === "hi"
  ? "आपने नया OTP अनुरोध किया है। नीचे दिया गया OTP उपयोग करें:"
  : "You requested a new OTP. Please use the code below:"}
</p>

<!-- OTP BOX -->
<div style="
margin:30px auto;
width:220px;
background:#fff3e0;
border:2px dashed #ff9800;
text-align:center;
font-size:28px;
letter-spacing:6px;
font-weight:bold;
color:#e65100;
padding:14px;
border-radius:8px;">
${otp}
</div>

<p style="font-size:13px;color:#555">
⏱ ${lang === "hi"
  ? "यह OTP 10 मिनट के लिए मान्य है"
  : "This OTP is valid for 10 minutes"}
</p>

<!-- SECURITY NOTE -->
<div style="
margin-top:18px;
background:#fdecea;
border-left:4px solid #d32f2f;
padding:12px;font-size:13px;">
⚠ ${lang === "hi"
  ? "यदि आपने यह अनुरोध नहीं किया है, तो तुरंत पासवर्ड बदलें"
  : "If you did not request this, secure your account immediately"}
</div>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#f7f9fb;padding:15px;
text-align:center;font-size:12px;color:#888">
${brandFooter()}
</td>
</tr>

</table>

${trackingPixel(trackId)}

</td>
</tr>
</table>
</body>
</html>
`;

export const ForgotPassword_Email_Template = ({
  name,
  resetUrl,
  trackId,
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
@media (prefers-color-scheme: dark) {
  body { background:#121212 !important; color:#fff !important; }
}
</style>
</head>

<body style="margin:0;padding:0;background:#f2f4f6;font-family:Segoe UI,Arial;">
<table width="100%">
<tr>
<td align="center" style="padding:25px">

<table width="600"
style="background:#ffffff;border-radius:12px;
box-shadow:0 8px 25px rgba(0,0,0,.08);">

<tr>
<td style="background:linear-gradient(135deg,#d32f2f,#b71c1c);
padding:28px;text-align:center;color:#fff">
<h2>Password Reset Request</h2>
</td>
</tr>

<tr>
<td style="padding:30px;font-size:15px">
<p>Hello <strong>${name}</strong>,</p>

<p>
We received a request to reset your <strong>ApkaKitchen</strong> password.
Click the button below to continue.
</p>

<div style="text-align:center;margin:30px 0;">
<a href="${resetUrl}"
style="
background:#d32f2f;
color:#ffffff;
padding:12px 28px;
border-radius:6px;
text-decoration:none;
font-weight:bold;">
Reset Password
</a>
</div>

<p style="font-size:13px;color:#555;">
⏱ This link is valid for <strong>15 minutes</strong>.
</p>

<div style="
background:#fdecea;
border-left:4px solid #d32f2f;
padding:12px;font-size:13px;">
⚠ If you didn’t request this, please ignore this email.
</div>
</td>
</tr>

<tr>
<td style="background:#f7f9fb;padding:15px;
text-align:center;font-size:12px;color:#888">
© ${new Date().getFullYear()} ApkaKitchen • Secure Account Recovery
</td>
</tr>

</table>

<img src="${process.env.APP_URL}/email/open/${trackId}" width="1" height="1" style="display:none;" />

</td>
</tr>
</table>
</body>
</html>
`;

