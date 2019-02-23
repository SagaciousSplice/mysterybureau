//helper functions

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not authorized');
        res.redirect('/login');
    },

    isAdmin: (req, res, next) => {
        if (req.user.userType === 'admin') {
            return next();
        }
        req.flash('error_msg', 'Not authorized admin');
        console.log(user);
        res.redirect('/');
    }
};
