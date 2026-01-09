const passport = require("passport");
const {
  Strategy: GoogleStrategy,
  Profile,
} = require("passport-google-oauth20");
const User = require("../Models/user.Model");

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log(user);
    done(null, user || null);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/callback/google",
    },
    async (authToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ oauthId: profile.id });
        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            oauthProvider: "google",
            oauthId: profile.id,
            image:{
              url: profile.photos?.[0].value,
            },
            email: profile.emails?.[0].value,
          });
        }
        console.log("authToken:" + authToken);
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
