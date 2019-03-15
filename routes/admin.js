module.exports = passport => {
    const router = require('express').Router();
    const { ensureAuthenticated } = require('../helpers/auth');
    const { isAdmin } = require('../helpers/auth');

    //Load Models
    require('../models/Customer');
    require('../models/Mystery');
    const Customer = require('../models/Customer');
    const Mystery = require('../models/Mystery');

    //Render the Admin Dashboard
    router.get('/dashboard', ensureAuthenticated, isAdmin, (req, res) => {
        res.render('admin/dashboard');
    });

    //Render the Add Mystery Form
    router.get('/addMystery', ensureAuthenticated, isAdmin, (req, res) => {
        res.render('admin/addMystery');
    });

    //Process the Add Mystery Form
    router.post('/addMystery', ensureAuthenticated, isAdmin, (req, res) => {
        let title = req.body.title;
        let name = req.body.name;
        let event1 = req.body.event1;
        let event2 = req.body.event2;
        let event3 = req.body.event3;
        let event4 = req.body.event4;
        let event5 = req.body.event5;
        let event6 = req.body.event6;

        Mystery.findOne({ title: title }, (err, title) => {
            if (err) return err;
            if (title) {
                req.flash('error_msg', 'That title is already being used.');
                res.redirect('/admin/addMystery');
            } else {
                //check if reference name is used
                Mystery.findOne({ name: name }, (err, name) => {
                    if (err) return err;
                    if (name) {
                        req.flash(
                            'error_msg',
                            'That reference name is already being used,'
                        );
                        res.redirect('/admin/addMystery');
                    } else {
                        //create the new mystery
                        let newMystery = new Mystery();
                        newMystery.title = req.body.title;
                        newMystery.name = req.body.name;
                        newMystery.event1 = req.body.event1;
                        newMystery.event2 = req.body.event2;
                        newMystery.event3 = req.body.event3;
                        newMystery.event4 = req.body.event4;
                        newMystery.event5 = req.body.event5;
                        newMystery.event6 = req.body.event6;
                        newMystery
                            .save()
                            .then(mystery => {
                                req.flash(
                                    'sucess_msg',
                                    'Mystery has been added.'
                                );
                                res.render('mysteries');
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            });
                    }
                });
            }
        });
    });

    // Add Admin User Form
    router.get('/addAdmin', ensureAuthenticated, isAdmin, (req, res) => {
        res.render('admin/addAdmin');
    });

    //Process Add Admin User Form
    router.post('/addAdmin', (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        Customer.findOne({ email: email }, (err, customer) => {
            if (err) return err;
            if (customer) {
                req.flash('error_msg', 'That email is already registered.');
                res.redirect('/admin/addAdmin');
            } else {
                let newAdmin = new Customer();
                newAdmin.email = email;
                newAdmin.password = newAdmin.generateHash(password);
                newAdmin.firstName = firstName;
                newAdmin.lastName = lastName;
                newAdmin.userType = 'admin';
                newAdmin
                    .save()
                    .then(admin => {
                        req.flash('sucess_msg', 'Admin user has been added.');
                        res.render('admin/dashboard');
                    })
                    .catch(err => {
                        console.log(err);
                        return;
                    });
            }
        });
    });

    // Customer List Page
    router.get('/customers', ensureAuthenticated, isAdmin, (req, res) => {
        Customer.find({})
            .sort({ lastName: 'asc' })
            .then(customers => {
                res.render('admin/customers', {
                    customers: customers
                });
            });
    });

    return router;
};
