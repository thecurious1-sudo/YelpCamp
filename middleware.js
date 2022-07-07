const ExpressError = require("./utils/ExpressError");
const { campgroundSchema ,reviewSchema} = require("./schemas");
const Campground = require("./models/campground");
const Review = require('./models/review');

module.exports.isLoggedIn = async (req, res, next) => {
    //console.log(req.user)   
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.session.randomShit = "SADsads";
        res.cookie('returnTo', req.originalUrl);
        //console.log(req.session);
        req.flash('error', 'You need to be logged in to do that!');
        return res.redirect('/login');
    }
    next();
}



module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
      const msg = result.error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else next();
  };
  
  
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
      req.flash('error', "You don't have permission to do that!")
      return res.redirect('/campgrounds/'+id);
    }
    next();
}
  
module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
      req.flash('error', "You don't have permission to do that!")
      return res.redirect('/campgrounds/'+id);
    }
    next();
  }
  
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      const msg = result.error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else next();
  };