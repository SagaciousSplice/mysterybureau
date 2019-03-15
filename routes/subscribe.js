module.exports = passport => {
    const router = require('express').Router();
    const { ensureAuthenticated } = require('../helpers/auth');

    let Haikunator = require('haikunator');
    let generatePassword = require('password-generator');

    //Load Models
    require('../models/Customer');
    require('../models/Mystery');
    require('../models/Order');
    const Customer = require('../models/Customer');
    const Mystery = require('../models/Mystery');
    const Order = require('../models/Order');

    /* PREFACED WITH /subscribe */

    //Load The Case of the Egyptian Archaeologist's Curse into order form
    router.get('/egypt', (req, res) => {
        let user = req.user;

        Mystery.findOne({ name: 'egypt' }, (err, mystery) => {
            // console.log('mystery is: ' + mystery);
            //put the mystery into the session to retrieve it in the order pages - breaking OOP
            req.session.mystery = mystery;
            req.session.total = mystery.price + mystery.tax;

            if (err) throw err;
            if (!mystery) {
                req.flash('error_msg', 'That mystery is currently unvailable.');
                res.redirect('/mysteries');
            } else if (!user) {
                //send to login
                // console.log('Now mystery is: ' + req.session.mystery);
                res.render('subscribe/login', { mystery });
            } else {
                let total = mystery.price + mystery.tax;
                res.redirect('/subscribe/order');
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
        console.log('in Order');

        let mystery = req.session.mystery;
        let user = req.user;
        let total = mystery.price + mystery.tax;

        //make the order in here, and log the order number to the session

        //get the secret name and the secret code
        let haikunator = new Haikunator();
        let secretName = haikunator.haikunate({
            tokenLength: 0,
            delimiter: ' '
        });
        let secretCode = generatePassword();

        console.log(secretCode, secretName);

        Order.findOne({ secretCode: secretCode }, function(err, order) {
            // if there are any errors, return the error
            if (err) {
                return err;
            }

            // check to see if theres already a customer with that name and code
            if (order) {
                console.log('in order found');

                req.flash(
                    'error_msg',
                    'That secret name and secret code combination is already taken: ' +
                        secretName +
                        ' ' +
                        secretCode
                );

                res.redirect('/mysteries');
            } else {
                // if there is no order with that name and code combo
                // create the order
                console.log('About to make the order');
                let newOrder = new Order();
                req.session.order = newOrder.id;
                // set the customer's local credentials
                newOrder.mystery = mystery;
                newOrder.customer = user;
                newOrder.secretName = secretName;
                newOrder.secretCode = secretCode;
                // save the customer
                newOrder.save(function(err) {
                    if (err) throw err;
                    console.log(newOrder);
                    res.render('subscribe/order', {
                        newOrder,
                        mystery,
                        user,
                        total
                    });
                });
            }
        });
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

    //Update Shipping processing
    router.put('/updateShipping', (req, res) => {
        console.log('in updateShipping');
        console.log(req.body);
        res.redirect('/subscribe/order');
    });

    //Create order middle step before success page
    router.put('/createOrder', ensureAuthenticated, (req, res) => {
        console.log('in createOrder');
        console.log(req.body);
        res.redirect('/subscribe/success');
    });

    //Success page
    router.get('/success', ensureAuthenticated, (req, res) => {
        let mystery = req.session.mystery;
        let user = req.user;
        console.log('in success');
        let shippingMsg;
        console.log(req.session.shippingMethod);

        if (req.body.optradio == '1') {
            shippingMsg =
                'We will send you all you need to deliver the mystery to your dectective yourself.';
        } else if (req.body.optradio == '0') {
            shippingMsg = 'We will ship the mystery to your dectective soon!';
        }

        res.render('subscribe/success', { mystery, user, shippingMsg });
    });

    // // Logout User
    // router.get('/logout', ensureAuthenticated, (req, res) => {
    //     req.logout();
    //     req.flash('success_msg', 'You are now logged out');
    //     res.redirect('/login');
    // });

    //load the fake file
    router.get('/fake', (req, res) => {
        res.render('subscribe/fake');
    });

    return router;
};
