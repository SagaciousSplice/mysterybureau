module.exports = passport => {
    const router = require('express').Router();
    const { ensureAuthenticated } = require('../helpers/auth');
    const { isAdmin } = require('../helpers/auth');

    //Load Models
    require('../models/Customer');
    require('../models/Mystery');
    const Customer = require('../models/Customer');
    const Mystery = require('../models/Mystery');
    // const Detective = require('../models/Detective');

    //Render Detective Login
    router.get('/login', (req, res) => {
        console.log(req.baseUrl);
        res.render('detective/login');
    });

    return router;
};
