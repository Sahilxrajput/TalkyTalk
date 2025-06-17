require("dotenv").config();

const { app, server, express } = require("./socket/socket.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectToDb = require("./Db/db.js");
const path = require("path");
const User = require("./Models/user.Model.js");

//routes
const userRouter = require("./Routes/user.routes.js");
const messageRouter = require("./Routes/message.Routes.js");
const chatRouter = require("./Routes/chat.Routes.js");

const PORT = process.env.PORT || 8000;

connectToDb();
app.use(express.json()); // Parses JSON body
app.use(express.urlencoded({ extended: true })); //  Parses URL-encoded data
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_DB_URL,
  crypto: {
    secret: process.env.ATLAS_DB_URL,
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
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
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

app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

app.use("/users", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);


// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "Frontend/dist")));

// Catch-all handler: for any request that doesn't match an API route, send back React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend/dist" , "index.html"));
});

server.listen(PORT, (req, res) => {
  console.log(`server is listening ${PORT}`);
});
