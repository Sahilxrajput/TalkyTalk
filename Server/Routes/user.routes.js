const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../Controllers/user.controller.js");
const { userAuth } = require("../Middlewares/userAuth.js");
const multer = require("multer");
const { storage } = require("../utils/cloudConfig.js");
const upload = multer({ storage });


const signupValidation = [
  body("firstName")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  body("lastName")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("password should be atleast 4 char long"),
  // body("otp")
  //   .isLength({ min: 4 }, { max: 4 })
  //   .withMessage("OTP should be 4 digit long"),
];

const loginValidation =  [
    body("email").isEmail().withMessage("Email is required"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("password should be atleast 4 char long"),
  ]

router.get("/", userController.getAllUsers);


router.post(
  "/signup",
  // upload.single("file"),
  // signupValidation,
  userController.signUpUser
);

router.post("/get-otp", userController.getOtp);
router.post("/verify-otp", userController.verifyOtp);


router.post(
  "/login",
loginValidation,
  userController.loginUser
);

router.use(userAuth);

router.get("/profile", userController.getUserProfile);

router.get("/logout",  userController.logoutUser);

router.put("/update/:id",  userController.updateUserInfo);

router.put("/block",  userController.blockUser);

router.put("/unblock",  userController.unblockUser);

module.exports = router;