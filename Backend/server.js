require("dotenv").config();

const { app, server, express } = require("./socket/socket.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Message = require("./Models/message.Model.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectToDb = require("./Db/db.js");
require('./passport.js')

//routes
const User = require("./Models/user.Model.js");
const userRouter = require("./Routes/user.routes.js");
const messageRouter = require("./Routes/message.Routes.js");
const chatRouter = require("./Routes/chat.Routes.js");
const paymentRouter = require("./Routes/payment.Routes.js")

const PORT = process.env.PORT || 8000;

connectToDb();
app.use(express.json()); // Parses JSON body
app.use(express.urlencoded({ extended: true })); //  Parses URL-encoded data
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_DB_URL,
  crypto: {
    secret: process.env.DB_SECRET,
  },
  touchAfter: 24 * 60 * 60, // 24 hours
});

store.on("error", function (e) {
  console.log("Mongo Session store error", e);
});

const sessionOptions = {
  store,
  secret: process.env.DB_SECRET,
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

app.get('/', (req, res)=>{
  res.send({
    activeStatus: true,
    error:false,
  })
})

app.use("/payment", paymentRouter);
app.use("/message", messageRouter);
app.use("/users", userRouter);
app.use("/chat", chatRouter);

app.listen(PORT, (req, res) => {
  console.log(`sever is listening ${PORT}`);
});
