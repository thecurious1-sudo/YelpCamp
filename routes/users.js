const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const cookiePasrser = require("cookie-parser");

router.get('/register', async (req, res) => { 
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    }
    catch (e)
    {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));


router.get('/login', async(req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo:true }), (req, res) => {
    //console.log(req.session)    
    req.flash('success', 'Welcome to Yelp Camp!');   
    const redirectUrl = req.cookies.returnTo || '/campgrounds';
    res.redirect(redirectUrl);  
});


router.get('/logout',isLoggedIn, async (req, res) => {
    req.logout(() => {
        console.log('logged out');
        req.flash('success', 'Logged out successfully!');
    res.redirect('/campgrounds');
    });
    
})
module.exports = router;