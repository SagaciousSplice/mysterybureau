module.exports = (app, passport) => {
    // //Load routes
    //const customer = require('./customer');

    //use routes
    app.use('/customer', require('./customer')(passport));
    app.use('/subscribe', require('./subscribe')(passport));
    app.use('/admin', require('./admin')(passport));

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
        const title = '';
        res.render('mysteries', {
            title: title,
            message: req.flash('loginMessage')
        });
    });

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

    // Test Page
    app.get('/getFake', (req, res) => {
        res.redirect('/subscribe/fake');
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
