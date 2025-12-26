import nodemailer from "nodemailer";
import AutoReplyLog from "../model/autoReplyLog.js";

const AUTO_REPLY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

export const sendContactMail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    /* 📩 Admin Mail */
    await transporter.sendMail({
      from: `"Apna Kitchen" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      replyTo: email,
      subject: `📩 New Contact Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr/>
        <p>Apna Kitchen Website</p>
      `,
    });

    /* 🧠 DB Anti-Spam Check */
    const existing = await AutoReplyLog.findOne({ email });
    const now = new Date();

    let shouldAutoReply = true;

    if (existing) {
      const diff = now - existing.lastSentAt;
      if (diff < AUTO_REPLY_COOLDOWN) {
        shouldAutoReply = false;
      }
    }

    /* ✉️ Branded Auto Reply */
    if (shouldAutoReply) {
      const logoUrl = `${process.env.PUBLIC_URL}/assets/logo.png`;

      await transporter.sendMail({
        from: `"Apna Kitchen" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Thanks for contacting Apna Kitchen! 🍛",
        html: `
        <div style="margin:0;padding:0;background:#fff7ed;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0"
            style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
            
            <tr>
              <td style="background:linear-gradient(90deg,#ea580c,#dc2626);padding:20px;text-align:center;">
                <img src="${logoUrl}" alt="Apna Kitchen" style="height:60px;margin-bottom:10px;" />
                <h1 style="color:#ffffff;margin:0;">Apna Kitchen</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:30px;color:#333;">
                <h2 style="color:#ea580c;">Hello ${name},</h2>
                <p>
                  Thank you for contacting <strong>Apna Kitchen</strong> 🍽️  
                  We’ve received your message and our team will get back to you shortly.
                </p>

                <div style="background:#fff7ed;border-left:4px solid #ea580c;padding:15px;margin:20px 0;">
                  <strong>Your Message:</strong><br/>
                  ${message}
                </div>

                <p style="margin-top:30px;">
                  Warm regards,<br/>
                  <strong>Team Apna Kitchen</strong><br/>
                  📞 +91 87099 35537 | +91 73523 10303<br/>
                  📍 Purulia Road, Near AG Church, Kanta Toli, Ranchi – 834001
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f3f4f6;padding:15px;text-align:center;font-size:12px;color:#777;">
                This is an automated email. Please do not reply.<br/>
                © ${new Date().getFullYear()} Apna Kitchen
              </td>
            </tr>
          </table>
        </div>
        `,
      });

      // ⏱️ Save / Update log
      await AutoReplyLog.findOneAndUpdate(
        { email },
        { lastSentAt: now },
        { upsert: true, new: true }
      );
    }

    return res.json({
      success: true,
      message: "Message sent successfully",
    });

  } catch (err) {
    console.error("Mail error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
