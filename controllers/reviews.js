const Campground = require("../models/campground");
const Review = require("../models/review");


module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const campground = await Campground.findById(id);
    const newReview = await new Review(review);
    newReview.author=req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "Review created successfully!");
    res.redirect("/campgrounds/" + id);
}
  
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    console.log(campground);
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully!");
    res.redirect("/campgrounds/" + id);
  }