const { cloudinary } = require("../cloudinary");
const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxTkn = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mbxTkn });
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
  //console.log(baseClient);
};

module.exports.renderNew = async (req, res) => {
  //const campgrounds = await Campground.find({})
  res.render("campgrounds/new");
};

module.exports.createNew = async (req, res, next) => {
  const newCamp = await new Campground(req.body.campground);
  newCamp.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  newCamp.author = req.user._id;

  const response = await geocodingClient
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  newCamp.geometry = response.body.features[0].geometry;

  await newCamp.save();
  console.log(newCamp);
  req.flash("success", "Campground created successfully!");
  res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("author");
  console.log(campground);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEdit = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const newCampground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  newCampground.images.push(...images);
  await newCampground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await newCampground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  if (!newCampground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }

  req.flash("success", "Campground Updated successfully!");
  res.redirect("/campgrounds");
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground Deleted successfully!");
  res.redirect("/campgrounds");
};
