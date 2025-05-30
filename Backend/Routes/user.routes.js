const router = require("express").Router();
const User = require("../Models/user.Model.js");
const {body} = require("express-validator");
const userController = require("../Controllers/user.controller.js");
const authMiddleware = require("../Middlewares/userAuth.js")  
const multer = require("multer")
const {storage, cloudinary} = require("../cloudConfig.js")
const upload = multer({ storage })

 const signupValidation = [
    body("firstName").isLength({min: 3}).withMessage("First name must be at least 3 characters long"),
    body("lastName").isLength({min: 3}).withMessage("Last name must be at least 3 characters long"),
    body("username").isLength({min: 3}).withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email address"),
   // body("phoneNumber").isLength({min: 10, max: 10}).withMessage("Phone number must be 10 digits long"),
    body("password").isLength({min: 4}).withMessage("password should be atleast 4 char long"),
    body("otp").isLength({min:4},{max:4}).withMessage("OTP should be 4 digit long"),
    body("confirmPassword").isLength({min: 4}).withMessage("password should be atleast 4 char long"),
    body('age')
    .exists({ checkFalsy: true }).withMessage('Age is required')
    .isInt({ min: 10 }).withMessage('Age must be at least 10'),
    body("gender").notEmpty().withMessage("gender is required"),
]


router.get("/", userController.getAllUsers);

router.post('/signup', upload.single("image"), signupValidation, userController.signUpUser);

router.post('/login',[
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({min: 4}).withMessage("password should be atleast 4 char long"),
], userController.loginUser)

router.get('/profile', authMiddleware.userAuth, userController.getUserProfile)

router.get('/logout', authMiddleware.userAuth, userController.logoutUser)

router.put('/update/:id', authMiddleware.userAuth, userController.updateUserInfo)

router.put('/block', authMiddleware.userAuth, userController.blockUser)

router.put('/unblock', authMiddleware.userAuth, userController.unblockUser)

module.exports = router;