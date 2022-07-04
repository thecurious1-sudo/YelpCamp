const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async (campground) => {
  const res = await Review.deleteMany({ _id: { $in: campground.reviews } }); //delete all reviews associated with this campground
  console.log(res);
});

module.exports = mongoose.model("Campground", CampgroundSchema);
