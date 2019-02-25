module.exports = passport => {
    const router = require('express').Router();
    const { ensureAuthenticated } = require('../helpers/auth');

    //Load Models
    require('../models/Customer');
    require('../models/Mystery');
    const Customer = require('../models/Customer');
    const Mystery = require('../models/Mystery');

    /* PREFACED WITH /subscribe */

    //Load The Case of the Egyptian Archaeologist's Curse into order form
    router.get('/egypt', (req, res) => {
        let user = req.user;

        Mystery.findOne({ name: 'egypt' }, (err, mystery) => {
            // console.log('mystery is: ' + mystery);
            //put the mystery into the session to retrieve it in the order pages - breaking OOP
            req.session.mystery = mystery;

            if (err) throw err;
            if (!mystery) {
                req.flash('error_msg', 'That mystery is currently unvailable.');
                res.redirect('/mysteries');
            } else if (!user) {
                //send to login
                // console.log('Now mystery is: ' + req.session.mystery);
                res.render('subscribe/login', { mystery });
            } else {
                res.render('subscribe/order', { mystery });
            }
        });
    });

    //Load Order Login Form
    router.get('/login', (req, res) => {
        res.render('subscribe/login');
    });

    //Process Order Login Form
    router.post(
        '/login',
        passport.authenticate('local-login', {
            failureRedirect: '/subscribe/login',
            failureFlash: true
        }),
        (req, res) => {
            // console.log('in post redirect: ');
            // console.log(req.session.mystery);
            res.redirect('/subscribe/order');
        }
    );

    //Load Order Login Form
    router.get('/registration', (req, res) => {
        res.render('subscribe/registration');
    });

    //Process Order Login Form
    router.post(
        '/registration',
        passport.authenticate('local-signup', {
            failureRedirect: '/subscribe/registration',
            failureFlash: true
        }),
        (req, res) => {
            // console.log('in post redirect: ');
            // console.log(req.session.mystery);
            res.redirect('/subscribe/order');
        }
    );

    //Load subscription page
    router.get('/order', ensureAuthenticated, (req, res) => {
        let mystery = req.session.mystery;
        res.render('subscribe/order', { mystery });
    });

    //Load Special Delivery Instructions page
    router.get('/specialDelivery', ensureAuthenticated, (req, res) => {
        res.render('subscribe/specialDelivery');
    });

    //Update Customer Billing
    router.put('/updateCustomer', ensureAuthenticated, (req, res) => {
        let body = req.body;
        console.log(body);
        let email = req.body.email;
        Customer.findOne({
            email: email
        }).then(customer => {
            //new customer values
            customer.email = body.email;
            customer.firstName = body.firstName;
            customer.lastName = body.lastName;
            customer.address1 = body.address1;
            customer.address2 = body.address2;
            customer.city = body.city;
            customer.provState = body.provState;
            customer.country = body.country;
            customer.postalZip = body.postalZip;

            console.log(customer);

            customer.save().then(customer => {
                res.redirect('/subscribe/order');
            });
        });
    });

    // Logout User
    router.get('/logout', ensureAuthenticated, (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are now logged out');
        res.redirect('/login');
    });

    //load the fake file
    router.get('/fake', (req, res) => {
        res.render('subscribe/fake');
    });

    return router;
};
