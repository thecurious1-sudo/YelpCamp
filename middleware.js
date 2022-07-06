module.exports.isLoggedIn = async(req, res, next) => {
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
