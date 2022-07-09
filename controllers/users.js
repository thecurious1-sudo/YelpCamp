const User = require("../models/user");


module.exports.renderNew= async (req, res) => { 
    res.render('users/register');
}

module.exports.createNew=async (req, res,next) => {
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
}

module.exports.renderLogin=  async(req, res) => {
    res.render('users/login');
}

module.exports.login= (req, res) => {
    //console.log(req.session)    
    req.flash('success', 'Welcome to Yelp Camp!');   
    const redirectUrl = req.cookies.returnTo || '/campgrounds';
    res.redirect(redirectUrl);  
}

module.exports.logout= async (req, res) => {
    req.logout(() => {
        console.log('logged out');
        req.flash('success', 'Logged out successfully!');
    res.redirect('/campgrounds');
    });
    
}