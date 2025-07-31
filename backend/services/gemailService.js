// services/gemailService.js

const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"WomenConnect Hub" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Gmail send error:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = {
  sendMail,
};
