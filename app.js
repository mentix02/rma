require("dotenv").config();
const path = require("path");
const morgan = require("morgan");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/users");
const indexRouter = require("./routes/index");
const resultRouter = require("./routes/results");

const PORT = process.env.PORT || "3000";
const SESSION_SECRET = process.env.SESSION_SECRET || "f4gM0yT1zQe7Mg";

const app = express();

// Logger
app.use(morgan("dev"));

// Views
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Body parsing
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and auth
app.use(
  session({
    resave: false,
    secret: SESSION_SECRET,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/results", resultRouter);

app.listen(PORT, () => console.log(`app running on http://localhost:${PORT}`));
