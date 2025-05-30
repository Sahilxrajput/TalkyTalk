const User = require("../Models/user.Model.js");
const passport = require("passport");
const { validationResult } = require("express-validator");
const { serverOtp } = require("../sendEmail.js");
const { application } = require("express");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users && users.length > 0) {
      // users.forEach((user) => console.log(user.email)); // logs each email
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

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const {
      username,
      firstName,
      confirmPassword,
      otp,
      lastName,
      email,
      age,
      bio,
      password,
      gender,
    } = req.body;

    let url = req.file.path;
    let filename = req.file.filename;

    console.log(`${otp} = is otp`);
    console.log(`${serverOtp} = is serverOtp`);
    if(otp !== serverOtp){
        return res.status(401).json({ message: "Invalid OTP. Please try again." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm Password do not match" });
    }
    const newUser = new User({
      email,
      gender,
      age,
      bio,
      firstName,
      lastName,
      username,
    });

    newUser.image = { url, filename };

    User.register(newUser, password, async (err, user) => {
      if (err) {
        console.log("Registration error:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("User Registered successful", user);

      const token = user.getAuthToken(); // Assuming you have a method to generate a token

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      req.login(user, (LoginErr) => {
        if (LoginErr) {
          console.log("login after signin err", LoginErr);
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

module.exports.loginUser = async (req, res, next) => {
  req.logout(async (logoutErr) => {
    if (logoutErr) {
      return res.status(400).json({ error: "Current user could not be logged out" });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error during login" });
      }

      if (!user) {
        console.log(info);
        return res.status(401).json({ error: info.message || "Invalid credentials" });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session error:", loginErr);
          return res.status(500).json({ error: "Failed to establish session" });
        }

        const token = user.getAuthToken(); // Make sure this method exists
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
    // console.log(req.user);
    return res.json({ user: req.user });
  } catch (error) {
    console.error("Error fetching User profile:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

module.exports.logoutUser = async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("logout error", err);
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
