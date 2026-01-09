const router = require("express").Router();
const passport = require("passport");


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google callback route
router.get(
  "/callback/google",
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    const user = req.user;
    const token = user.generateAuthToken(user);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`${process.env.CLIENT_URL}/auth/success`);
  }
);

router.get("/login/failed", (req,res)=>{
    console.log("login failed")
    res.json("failed")
});


module.exports = router;
