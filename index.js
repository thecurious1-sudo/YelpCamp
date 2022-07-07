const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas");
let db;
const session = require("express-session");
const cookiePasrser=require("cookie-parser");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes= require("./routes/users");

const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User= require('./models/user');

app.listen(3000, () => {
  console.log("Listening to 3000!");
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
const sessionConfigOptions = {
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfigOptions));
app.use(flash());
app.use(cookiePasrser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  console.log(req.session)
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser= req.user;
  next();
});
mongoose
  .connect("mongodb://localhost:27017/yelpCamp")
  .then(() => {
    console.log("Connection established!");
  })
  .catch((err) => {
    console.log(err);
  });
db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/review", reviewRoutes);
app.use('/', userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.use("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  err.message = message;
  err.status = statusCode;
  res.status(statusCode);
  res.render("error", { err });
});
