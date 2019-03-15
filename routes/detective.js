module.exports = passport => {
    const router = require('express').Router();
    const { isDetective } = require('../helpers/auth');

    //Load Models
    require('../models/Customer');
    require('../models/Mystery');
    require('../models/Order');
    const Customer = require('../models/Customer');
    const Mystery = require('../models/Mystery');
    const Order = require('../models/Order');
    // const Detective = require('../models/Detective');

    //Render Detective Login
    router.get('/login', (req, res) => {
        console.log(req.baseUrl);
        res.render('detective/login');
    });

    //Process Detective Login
    router.post(
        '/login',
        passport.authenticate('detective-login', {
            failureRedirect: '/detective/login',
            failureFlash: true
        }),
        (req, res) => {
            req.session.orderDetails = req.user;
            // console.log('user when detective logged in');
            // console.log(req.session.orderDetails);
            res.redirect('/detective/dashboard');
        }
    );

    // Logout User
    router.get('/logout', isDetective, (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are now logged out');
        req.session.destroy();
        res.redirect('/detective/login');
    });

    //Render Detective Dashboard
    router.get('/dashboard', isDetective, (req, res) => {
        console.log('render dashboard');
        // console.log(req.session.orderDetails);
        // let order = req.session.orderDetails;
        Mystery.findById(req.session.orderDetails.mystery, (err, mystery) => {
            if (err) {
                req.flash('an error occured');
                res.render('/detective/login');
            } else if (!mystery) {
                req.flash('no mystery found');
                res.render('/detective/login');
            }
            res.render('detective/dashboard', mystery);
        });
        // res.render('detective/dashboard');
    });

    //Render Detective Dashboard
    router.get('/questions', isDetective, (req, res) => {
        console.log('render dashboard');
        // console.log(req.session.orderDetails);
        // let order = req.session.orderDetails;
        Mystery.findById(req.session.orderDetails.mystery, (err, mystery) => {
            if (err) {
                req.flash('an error occured');
                res.render('/detective/login');
            } else if (!mystery) {
                req.flash('no mystery found');
                res.render('/detective/login');
            }
            res.render('detective/questions', mystery);
        });
        // res.render('detective/dashboard');
    });

    return router;
};
