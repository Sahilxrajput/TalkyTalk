require("dotenv").config({ path: "../.env" });
const http = require("http");
const nodemailer = require("nodemailer");
const User = require("../Models/user.Model.js");
const passport = require("passport");
const { validationResult } = require("express-validator");
const { error } = require("console");
const otpStore = require("../utils/otpStore.js");

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users && users.length > 0) {
      return res.status(200).json({
        message: "Users found",
        users, // optionally include users in response
      });
    } else {
      return res.status(404).json({ error: "No users found" });
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports.signUpUser = async (req, res) => {
  try {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      return res.status(400).json({ error: err.array() });
    }

    const { username, firstName, lastName, email, password, bio } = req.body;

    let url = req.file.path;
    let filename = req.file.filename;

    const newUser = new User({
      email,
      bio,
      firstName,
      lastName,
      username,
      image: {
        url,
        filename,
      },
    });

    User.register(newUser, password, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const token = user.getAuthToken();

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      req.login(user, (LoginErr) => {
        if (LoginErr) {
          return res.status(500).json({
            error: "Registration successful but automatic login failed",
          });
        }
        return res.status(201).json({
          success: true,
          user,
          token,
          message: "registration successful",
        });
      });
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const otp = generateOtp();
    otpStore.set(email.trim(), otp);

    console.log(`OTP for ${email}: ${otp}`);

    const mailOptions = {
      from: `"TalkyTalk App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "OTP verification for TalkyTalk.",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p style="font-size: 18px; font-weight: bold; color: #333;">
        🔐 Your OTP is:
        <span style="font-size: 28px; font-weight: bold; color: #000;">${otp}</span>
      <p style="font-size: 12px;">Welcome to TalkyTalk – where conversations come to life! </p>
      Please use the OTP above to verify your email address. Do not share this OTP with anyone.
       If you didn’t request this, feel free to ignore this message.
      Thank you for choosing TalkyTalk. We can’t wait for you to explore all that we have in store!
      Warm regards, The TalkyTalk Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    setTimeout(() => {
      otpStore.delete(email); // this deletes OTP after 5 mins
    }, 5 * 60 * 1000);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email address.",
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: error.message,
    });
  }
};

module.exports.verifyOtp = (req, res) => {
  const { email, enteredOtp } = req.body;

  const savedOtp = otpStore.get(email.trim());

  if (!savedOtp) {
    return res.status(410).json({ message: "OTP expired or not found." });
  }

  if (String(savedOtp) === String(enteredOtp)) {
    otpStore.delete(email);
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  }

  res.status(400).json({ success: false, message: "Invalid OTP" });
};

module.exports.loginUser = async (req, res, next) => {
  req.logout(async (logoutErr) => {
    if (logoutErr) {
      return res
        .status(400)
        .json({ error: "Current user could not be logged out" });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error during login" });
      }

      if (!user) {
        return res
          .status(401)
          .json({ error: info.message || "Invalid credentials" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session error:", loginErr);
          return res.status(500).json({ error: "Failed to establish session" });
        }

        const token = user.getAuthToken();
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });

        return res.status(200).json({
          success: true,
          user,
          token,
          message: "Logged in successfully",
        });
      });
    })(req, res, next);
  });
};

module.exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ error: "profile is not valid" });
    }
    return res.json({ user: req.user });
  } catch (error) {
    console.error("Error fetching User profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports.logoutUser = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
  });
};

module.exports.updateUserInfo = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { id } = req.params;
    const { bio, username, firstName, lastName } = req.body;

    if (!loggedInUser._id.equals(id)) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to update this user's information.",
      });
    }

    if (!bio && !username && !firstName && !lastName) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (bio, username, firstName, or lastName) must be provided.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, bio, firstName, lastName },
      { new: true }
    ); // `new: true` returns the updated document

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with updated user info
    return res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.blockUser = async (req, res) => {
  const { blockerId, blockedId } = req.body;

  if (!blockerId || !blockedId) {
    return res.status(404).json({ message: "data invalid" });
  }

  await User.findByIdAndUpdate(blockerId, {
    $addToSet: { blockedUsers: blockedId },
  });
  res.status(200).json({ message: "User blocked successfully." });
};

module.exports.unblockUser = async (req, res) => {
  const { blockerId, blockedId } = req.body;

  if (!blockerId || !blockedId) {
    return res.status(404).json({ message: "data invaid" });
  }

  await User.findByIdAndUpdate(blockerId, {
    $pull: { blockedUsers: blockedId },
  });
  res.status(200).json({ message: "User unblocked successfully." });
};
