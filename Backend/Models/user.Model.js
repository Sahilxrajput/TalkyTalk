const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minLength: [3, "first name must be at least 3 char long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minLength: [3, "last name must be at least 3 char long"],
    },
    username: {
      type: String,
      required: true,
      minLength: [3, "username must be at least 3 char long"],
      match: [/^[^*@#]+$/, "Username cannot contain *, @, or #"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    age: {
      type: Number,
      // required: [true, "Age is required"],
      min: [12, "age should be more than 12"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      // required: [true, "Gender is required"],
    },
    chats: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    bio: {
      type: String,
      default: "Online!",
      max: [100, "Bio should be less than 100 char"],
    },
    image: {
      url: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/duh5cemec/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1749701448/profilePic_dliaem.jpg"
      },
      filename: {
        type: String,
        required: true,
      },
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

userSchema.methods.getAuthToken = function () {
  const token = jwt.sign({ _id: this.id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
