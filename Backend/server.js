require("dotenv").config();

const {app, server, express} = require("./socket/socket.js")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const session = require("express-session");
const {sendEmail} = require("./sendEmail.js");

const connectToDb = require("./Db/db.js");

//routes
const User = require("./Models/user.Model.js");
const userRouter = require("./Routes/user.routes.js");
const messageRouter = require('./Routes/message.Routes.js')
const chatRouter = require("./Routes/chat.Routes.js");

const PORT = process.env.PORT || 8000;

connectToDb();
app.use(express.json()); // Parses JSON body
app.use(express.urlencoded({ extended: true })); //  Parses URL-encoded data
app.use(cookieParser());

// app.use(cors()); ////////this is for the frontend to access the backend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate())
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//////////////Routes/////////////////////////////
// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users); // send to frontend
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

///////////////////multer,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // save files in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // save with unique filename
//   },
// });

// const upload = multer({ storage: storage });
// // Route to upload single file
// app.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   res.send(`File uploaded successfully: ${req.file.filename}`);
// });



app.use('/message', messageRouter)


app.use("/users", userRouter);
app.use("/chat", chatRouter);
app.post("/getotp", (req, res) => {
  sendEmail({
    to: req.body.to
  })
});

///////////////////////////////////////////////////////////////////

server.listen(PORT, () => console.log(`Server is running on port ${PORT}....`));
