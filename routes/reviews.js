const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");

const validateReview = (req, res, next) => {
  console.log("***");
  const result = reviewSchema.validate(req.body);
  if (result.error) {
    const msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    console.log("***");
    const { id } = req.params;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    console.log("***");
    console.log(campground);
    const newReview = await new Review(review);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Review created successfully!");
    res.redirect("/campgrounds/" + id);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    console.log(campground);
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect("/campgrounds/" + id);
  })
);

module.exports = router;
