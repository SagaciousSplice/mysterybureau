module.exports = (app, passport) => {
    // //Load routes
    //const customer = require('./customer');
    let Haikunator = require('haikunator');
    let generatePassword = require('password-generator');

    //models
    let Mystery = require('../models/Mystery');

    //use routes
    app.use('/customer', require('./customer')(passport));
    app.use('/subscribe', require('./subscribe')(passport));
    app.use('/admin', require('./admin')(passport));
    app.use('/detective', require('./detective')(passport));

    //Homepage
    app.get('/', (req, res) => {
        const title = '';
        res.render('index', {
            title: title, //sets the variable title for that page to this route's variable for title
            message: req.flash('loginMessage')
        });
    });

    //About and Contact Form
    app.get('/about', (req, res) => {
        const title = '';
        res.render('about', {
            title: title
        });
    });

    //Current Mysteries
    app.get('/mysteries', (req, res) => {
        Mystery.find({}, (err, mysteries) => {
            if (err) {
                req.flash('error_msg', 'error retrieving mystery list');
                res.render('mysteries');
            } else if (!mysteries) {
                req.flash('error_msg', 'no mysteries to be found');
                res.render('mysteries');
            }
            // mysteries.forEach(mystery => {
            //     console.log('mystery');
            //     console.log(mystery);
            //     console.log('mystery image link');
            //     console.log(mystery.image);
            // });
            const title = '';
            res.render('mysteries', { mysteries, title: title });
        });
    });
    // app.get('/mysteries', (req, res) => {
    //     const title = '';
    //     res.render('mysteries', {
    //         title: title,
    //         message: req.flash('loginMessage')
    //     });
    // });

    // Login Customer Form
    app.get('/login', (req, res) => {
        const title = '';
        res.render('login', {
            title: title,
            message: req.flash('loginMessage')
        });
    });

    // Process Login Form
    app.post(
        '/login',
        passport.authenticate('local-login', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        (req, res) => {
            // console.log('user', req.user);
            if (req.user.userType === 'admin') {
                res.redirect('/admin/dashboard');
            } else {
                res.redirect('/customer/profile/:id'), { customer: req.user };
            }
        }
    );

    //Load Detective Login Page
    app.get('/detectiveLogin', (req, res) => {
        res.redirect('/detective/login');
    });

    // Test Page
    app.get('/getFake', (req, res) => {
        res.redirect('/subscribe/fake');
    });

    //Random Word API Test Page
    app.get('/random', (req, res) => {
        //get words
        let haikunator = new Haikunator();
        let haiku = haikunator.haikunate({ tokenLength: 0, delimiter: ' ' });
        let password = generatePassword();

        res.render('random', { haiku, password });
    });

    // app.post(
    //     '/login',
    //     passport.authenticate('local-login', {
    //         successRedirect: '/customer/profile/:id',
    //         failureRedirect: '/',
    //         failureFlash: true
    //     })
    // );
};
