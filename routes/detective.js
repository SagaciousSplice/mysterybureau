module.exports = passport => {
    const router = require('express').Router();
    const { isDetective } = require('../helpers/auth');
    const http = require('http');
    const url = require('url');

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
            //set the session mystery
            req.session.mystery = req.session.orderDetails.mystery;

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
        //variable for passing events and clues and status
        let activeEvents = [];
        let activeClues = [];
        let notYetEvents = [];
        Mystery.findById(req.session.orderDetails.mystery, (err, mystery) => {
            if (err) {
                req.flash('an error occured');
                res.render('/detective/login');
            } else if (!mystery) {
                req.flash('no mystery found');
                res.render('/detective/login');
            }
            // console.log('in render dashboard');
            //grab the events for the mystery
            let events = mystery.events;
            events.forEach(event => {
                // console.log(event);
                //if event is completed, mail, or started, pass to list of items
                if (
                    event.status == 'mail' ||
                    event.status == 'started' ||
                    event.status == 'finished'
                ) {
                    activeEvents.push(event);
                    let clues = event.clues;
                    clues.forEach(clue => {
                        activeClues.push(clue);
                    });
                } else if (event.status == 'notYet') {
                    notYetEvents.push(event);
                }
            });

            res.render('detective/dashboard', {
                mystery,
                activeEvents,
                activeClues
            });
        });
    });

    //Render Image
    router.get('/image', (req, res) => {
        console.log('in image render');
        console.log(req.query.image);
        let image = req.query.image;

        res.render('detective/image', { image });
    });

    //Render Image pt2

    //Render Detective Dashboard
    router.get('/questions', isDetective, (req, res) => {
        console.log('render questions');
        console.log(req.session.mystery);
        mysteryId = req.session.mystery;
        Mystery.findById(mysteryId, (err, mystery) => {
            if (err) {
                req.flash('an error occured');
                res.render('/detective/dashboard');
            } else if (!mystery) {
                req.flash('no mystery found');
                res.render('/detective/dashboard');
            } else {
                let allEvents = mystery.events;
                let pastEvents = [];
                let currentEvent;
                let futureEvents = [];

                allEvents.forEach(event => {
                    if (event.status == 'notYet') {
                        futureEvents.push(event);
                    } else if (
                        event.status == 'mail' ||
                        event.status == 'started'
                    ) {
                        currentEvent = event;
                    } else if (event.status == 'finished') {
                        pastEvents.push(event);
                    }
                });

                // console.log('past');
                // console.log(pastEvents);
                console.log('current');
                console.log(currentEvent);
                // console.log('future');
                // console.log(futureEvents);
                let obj = currentEvent.questions;

                obj.forEach(question => {
                    console.log(question);
                });

                res.render('detective/questions', { currentEvent, mystery });
            }
        });
    });

    return router;
};
