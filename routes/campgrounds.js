const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const {isLoggedIn, isAuthor,validateCampground}=require("../middleware");


router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    //const campgrounds = await Campground.find({})
      res.render("campgrounds/new");
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({
      path: "reviews",
      populate: { path: 'author' }
      })
      .populate('author');
    console.log(campground);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "/",
  validateCampground,
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const newCamp = await new Campground(req.body.campground);
    newCamp.author=req.user._id;
    newCamp.save();
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    
    res.render("campgrounds/edit", { campground });
  })
);

router.patch(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCampground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      { new: true }
    );
    if (!newCampground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    req.flash("success", "Campground Updated successfully!");
    res.redirect("/campgrounds");
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground Deleted successfully!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
