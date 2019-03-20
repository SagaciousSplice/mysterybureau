// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;

// load up the customer model
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize customers out of session

    // used to serialize the customer for the session
    passport.serializeUser((customer, done) => {
        done(null, customer.id);
    });

    // used to deserialize the customer
    passport.deserializeUser((id, done) => {
        Customer.findById(id, function(err, customer) {
            done(err, customer);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                let address1 = req.body.address1;
                let address2 = req.body.address2;
                let city = req.body.city;
                let provState = req.body.provState;
                let country = req.body.country;
                let postalZip = req.body.postalZip;

                // asynchronous
                // Customer.findOne wont fire unless data is sent back
                process.nextTick(() => {
                    // find a customer whose email is the same as the forms email
                    // we are checking to see if the uscustomerer trying to login already exists
                    Customer.findOne({ email: email }, function(err, customer) {
                        // if there are any errors, return the error
                        if (err) return done(err);

                        // check to see if theres already a customer with that email
                        if (customer) {
                            return done(
                                null,
                                req.flash(
                                    'error_msg',
                                    'That email is already taken.'
                                )
                            );
                        } else {
                            // if there is no customer with that email
                            // create the customer
                            var newCustomer = new Customer();

                            // set the customer's local credentials
                            newCustomer.email = email;
                            newCustomer.password = newCustomer.generateHash(
                                password
                            );
                            newCustomer.firstName = firstName;
                            newCustomer.lastName = lastName;
                            newCustomer.address1 = address1;
                            newCustomer.address2 = address2;
                            newCustomer.city = city;
                            newCustomer.provState = provState;
                            newCustomer.country = country;
                            newCustomer.postalZip = postalZip;
                            // save the customer
                            newCustomer.save(function(err) {
                                if (err) throw err;
                                return done(null, newCustomer);
                            });
                        }
                    });
                });
            }
        )
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                // callback with email and password from our form
                // console.log('in passport: ');
                // console.log(req.session.mystery);

                // find a customer whose email is the same as the forms email
                // we are checking to see if the customer trying to login already exists
                Customer.findOne({ email: email }, (err, customer) => {
                    // if there are any errors, return the error before anything else
                    if (err) {
                        console.log('error: ' + err);
                        return done(err);
                    }
                    // if no customer is found, return the message
                    if (!customer)
                        return done(
                            null,
                            false,
                            req.flash('error', 'No customer found.')
                        ); // req.flash is the way to set flashdata using connect-flash

                    // if the customer is found but the password is wrong
                    // console.log('customer: ' + customer);
                    // console.log('password: ' + password);
                    if (!customer.validPassword(customer, password))
                        return done(
                            null,
                            false,
                            req.flash('error', 'Oops! Wrong password.')
                        ); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful customer
                    return done(null, customer, req);
                });
            }
        )
    );

    // =========================================================================
    // ADMIN SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'admin-signup',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                let firstName = req.body.firstName;
                let lastName = req.body.lastName;
                // asynchronous
                console.log('middle of admin-signup');
                // Customer.findOne wont fire unless data is sent back
                process.nextTick(() => {
                    // find a customer whose email is the same as the forms email
                    // we are checking to see if the uscustomerer trying to login already exists
                    Customer.findOne({ email: email }, function(err, customer) {
                        // if there are any errors, return the error
                        if (err) return done(err);

                        // check to see if theres already a customer with that email
                        if (customer) {
                            return done(
                                null,
                                req.flash(
                                    'error_msg',
                                    'That email is already taken.'
                                )
                            );
                        } else {
                            // if there is no customer with that email
                            // create the customer
                            var newCustomer = new Customer();

                            // set the customer's local credentials
                            newCustomer.email = email;
                            newCustomer.password = newCustomer.generateHash(
                                password
                            );
                            newCustomer.firstName = firstName;
                            newCustomer.lastName = lastName;
                            newCustomer.userType = 'admin';
                            console.log('new admin: ');
                            console.log(newCustomer);
                            // save the customer
                            newCustomer.save(function(err) {
                                if (err) throw err;
                                return done(null, newCustomer);
                            });
                        }
                    });
                });
            }
        )
    );

    // =========================================================================
    // DETECTIVE LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'detective-login',
        new LocalStrategy(
            {
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'secretName',
                passwordField: 'secretCode',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, secretName, secretCode, done) {
                // callback with email and password from our form
                // console.log('in detective passport: ');
                // console.log(secretName);
                // console.log(secretCode);

                // find a customer whose email is the same as the forms email
                // we are checking to see if the customer trying to login already exists
                Order.findOne(
                    { secretName: secretName, secretCode: secretCode },
                    (err, order) => {
                        // if there are any errors, return the error before anything else
                        if (err) {
                            console.log('error: ' + err);
                            return done(err);
                        }
                        // if no customer is found, return the message
                        if (!order)
                            return done(
                                null,
                                false,
                                req.flash('error', 'No order found.')
                            ); // req.flash is the way to set flashdata using connect-flash

                        // if the customer is found but the password is wrong
                        // console.log('customer: ' + customer);
                        // console.log('password: ' + password);
                        if (
                            !order.validSecretCode(
                                order,
                                secretName,
                                secretCode
                            )
                        )
                            return done(
                                null,
                                false,
                                req.flash('error', 'Oops! Wrong secret code.')
                            ); // create the loginMessage and save it to session as flashdata

                        // all is well, return successful customer
                        return done(null, order, req);
                    }
                );
            }
        )
    );
};
