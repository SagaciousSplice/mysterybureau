module.exports = passport => {
    const router = require('express').Router();
    const { ensureAuthenticated } = require('../helpers/auth');
    const bcrypt = require('bcryptjs');

    //Load Customer Model
    require('../models/Customer');
    const Customer = require('../models/Customer');

    // Customer Index Page
    router.get('/', ensureAuthenticated, (req, res) => {
        Customer.find({}).then(customers => {
            res.render('/customer/customers', {
                customers: customers
            });
        });
    });

    // Customer profile page
    router.get('/profile/:id', ensureAuthenticated, (req, res) => {
        Customer.findOne({ email: req.user.email }, (err, customer) => {
            if (err) return res.json(err);
            console.log({ customer });
            res.render('customer/profile', {
                customer
            });
        });
    });

    // Register a Customer Form
    router.get('/registration', (req, res) => {
        const title = '';
        res.render('customer/registration', {
            title: title
        });
    });

    // Process Registration Form
    router.post(
        '/registration',
        passport.authenticate('local-signup', {
            failureRedirect: '/registration',
            failureFlash: true
        }),
        (req, res) => {
            console.log('user', req.user);
            if (req.user.isAdmin === true) {
                res.redirect('/customer/customers');
            } else {
                res.redirect('/customer/profile/:id'), { customer: req.user };
            }
        }
    );

    // Edit Customer Form
    router.get('/edit/:id', ensureAuthenticated, (req, res) => {
        Customer.findOne({
            _id: req.params.id
        }).then(customer => {
            console.log(customer.email);
            res.render('customer/edit', {
                customer: customer
            });
        });
    });

    //Edit customer process form - REALLY NEED TO FIGURE OUT UPDATE FUNCTION
    router.put('/edit/:id', ensureAuthenticated, (req, res) => {
        let errors = [];

        if (!req.body.email) {
            errors.push({ text: 'Please add an email' });
        }
        if (!req.body.firstName) {
            errors.push({ text: 'Please add a first name' });
        }
        if (!req.body.lastName) {
            errors.push({ text: 'Please add a last name' });
        }
        if (!req.body.password) {
            errors.push({ text: 'Please add a password' });
        }
        if (!req.body.confirmPassword) {
            errors.push({ text: 'Please confirm your password' });
        }
        if (req.body.password !== req.body.confirmPassword) {
            errors.push({ text: 'Please make sure passwords are the same' });
        }

        //if no entry errors
        if (errors.length > 0) {
        } else {
            Customer.findOne({
                _id: req.params.id
            }).then(customer => {
                //new customer values
                customer.email = req.body.email;
                customer.firstName = req.body.firstName;
                customer.lastName = req.body.lastName;
                customer.password = req.body.password;

                //hash the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(customer.password, salt, (err, hash) => {
                        if (err) throw err;
                        customer.password = hash;

                        console.log(customer);

                        customer.save().then(customer => {
                            res.redirect('/customer/customers');
                        });
                    });
                });
            });
        }
    });

    // Delete customers process form
    router.delete('/edit/:id', ensureAuthenticated, (req, res) => {
        Customer.deleteOne({ _id: req.params.id }).then(() => {
            res.redirect('/customer/customers');
        });
    });

    // Logout User
    router.get('/logout', ensureAuthenticated, (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are now logged out');
        res.redirect('/login');
    });

    // Test Page
    // router.get('/getFake', (req, res) => {
    //     res.redirect('/subscribe/fake');
    // });

    return router;
};
