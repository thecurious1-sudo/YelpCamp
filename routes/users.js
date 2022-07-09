const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const userController = require("../controllers/users");


router.route('/register')
    .get(userController.renderNew)
    .post(catchAsync(userController.createNew));

router.route('/login')  
    .get(userController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }),  userController.login);

router.get('/logout', isLoggedIn, catchAsync(userController.logout));

module.exports = router;