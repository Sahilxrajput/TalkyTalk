
require("dotenv").config();
const http = require("http");
const nodemailer = require("nodemailer");

const serverOtp = Math.floor(1000 + Math.random() * 9000).toString();
console.log(serverOtp);

const sendEmail = async ({ to}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use any SMTP service (Gmail, Outlook, etc.)
      secure: true,
      port: 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"TalkyTalk App" <${process.env.MAIL_USER}>`,
      to: to,
      subject: "OTP verification for TalkyTalk.",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="font-size: 18px; font-weight: bold; color: #333;">
        🔐 Your OTP is:
        <span style="font-size: 28px; font-weight: bold; color: #000;">${serverOtp}</span>
      <p style="font-size: 12px;">Welcome to TalkyTalk – where conversations come to life! </p> 
      Please use the OTP below to verify your email address: Please do not share this otp with anyone. 
       If you didn’t request this, feel free to ignore this message.
      Thank you for choosing TalkyTalk. We can’t wait for you to explore all that we have in store!
      Warm regards, The TalkyTalk Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = {sendEmail, serverOtp};
