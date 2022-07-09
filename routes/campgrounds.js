const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgroundController = require("../controllers/campgrounds");
const multer = require("multer");
const {storage}=require("../cloudinary");

const upload = multer({ storage})

router.route("/")
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn,  upload.array('image'), validateCampground, catchAsync(campgroundController.createNew));
    // .post(upload.array('image'),(req, res) => {
    //     console.log(req.files);
    //     res.send("It worked!");
    // });
router.get("/new", isLoggedIn, catchAsync(campgroundController.renderNew));

router.route("/:id")
    .get(catchAsync(campgroundController.show))
    .patch( isLoggedIn, isAuthor, upload.array('image') ,validateCampground, catchAsync(campgroundController.edit) )
    .delete( isLoggedIn, isAuthor, catchAsync(campgroundController.delete) );

router.get( "/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundController.renderEdit) );



module.exports = router;
