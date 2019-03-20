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
        console.log('in dashboard');
        console.log(req.session.orderDetails);
        if (
            req.session.orderDetails.currentEvent >
            req.session.orderDetails.numberEvents
        ) {
            console.log('The mystery is over');

            //update order with mysteryCompleted = true;
        }
        //variable for passing events and clues and status
        let clues = [];

        Order.findById(req.session.orderDetails._id, (err, order) => {
            if (err) {
                req.flash('an error occured');
                res.render('/detective/login');
            } else if (!order) {
                req.flash('no mystery for that agent found');
                res.render('/detective/login');
            }

            //get the current set of questions from mystery
            let mysteryId = req.session.orderDetails.mystery;
            // console.log(mysteryId);

            Mystery.findById(mysteryId, (err, mystery) => {
                console.log('get events');
                // console.log(mystery);
                let events = mystery.events;
                // console.log(events);
                wantedEvent = events.filter(
                    obj =>
                        obj.eventNumber <= req.session.orderDetails.currentEvent
                );
                console.log(wantedEvent);

                //get the questions from the event:
                let currentEvent = wantedEvent;
                currentEvent.forEach(events => {
                    console.log('in foreach');
                    // console.log(events);
                    events.clues.forEach(clue => {
                        clues.push(clue);
                    });
                });
                // clues = currentEvent.clues;
                req.session.currentEvent = currentEvent;
                console.log(clues);

                res.render('detective/dashboard', {
                    mystery,
                    currentEvent,
                    clues
                });
            });
        });
    });

    //Render Image
    router.get('/image', isDetective, (req, res) => {
        console.log('in image render');
        console.log(req.query.image);
        let image = req.query.image;

        res.render('detective/image', { image });
    });

    //Render Detective Dashboard
    router.get('/questions', isDetective, (req, res) => {
        console.log('render questions');
        let wantedEvent;
        let questionArray;
        // console.log(req.session.mystery);
        orderId = req.session.orderDetails._id;
        currentEvent = req.session.currentEvent;
        // console.log(orderId);
        Order.findById(orderId, (err, order) => {
            console.log(order);
            if (err) {
                req.flash('an error occured');
                res.render('detective/dashboard');
            } else if (!order) {
                req.flash('no order found');
                res.render('detective/dashboard');
            } else if (currentEvent > order.numberEvents) {
                req.flash('no more questions for you!');
                res.render('detective/dashboard');
            } else {
                //get currentEvent (updated last time in, or default to 1)
                let currentEvent = order.currentEvent;
                console.log(currentEvent);

                //get the current set of questions from mystery
                let mysteryId = req.session.orderDetails.mystery;
                // console.log(mysteryId);

                //check if mystery is over

                Mystery.findById(mysteryId, (err, mystery) => {
                    console.log('get events');
                    // console.log(mystery);
                    let events = mystery.events;
                    // console.log(events);
                    wantedEvent = events.filter(
                        obj => obj.eventNumber == currentEvent
                    );
                    console.log(wantedEvent);

                    //get the questions from the event:
                    currentEvent = wantedEvent[0];
                    questionArray = currentEvent.questions;
                    req.session.currentEvent = currentEvent;
                    console.log(questionArray);

                    res.render('detective/questions', {
                        mystery,
                        currentEvent,
                        questionArray
                    });
                });
            }
        });
    });

    //Process Answer Submission
    router.put('/answered', isDetective, (req, res) => {
        console.log('in answered');
        console.log('check order details');
        console.log(req.session.orderDetails);

        //create vars to hold quesions and answers for updating order
        let newQuestions = [];
        let newAnswers = [];

        //grab the questions to be added
        req.session.currentEvent.questions.forEach(question => {
            newQuestions.push(question.question);
        });

        //grab the answers to those questions in order
        for (i = 0; i < req.session.currentEvent.questions.length; i++) {
            let name = 'answer' + i;
            newAnswers.push(req.body[name]);
        }

        let id = req.session.orderDetails._id;
        console.log('id for update');
        console.log(id);

        //update the order by id with the questions and answers given
        Order.findOne({ _id: id }).exec((err, order) => {
            //now past event number
            let previousEvent = req.session.currentEvent.eventNumber;
            r;
            //now current event number
            let currentEvent = req.session.currentEvent.eventNumber + 1;
            //now next event number
            let nextEvent = currentEvent + 1;
            // console.log(order.answers);
            order.answers.push(newAnswers);
            order.questions.push(newQuestions);
            order.previousEvent = previousEvent;
            order.currentEvent = currentEvent;
            order.nextEvent = nextEvent + 1;
            order.save(err => {
                if (err) {
                    console.log('error saving order answers and questions');
                    return err;
                }
                console.log('successful q&a update');
            });
        });

        //need to update current event

        console.log('after answered update');
        console.log(req.session.orderDetails);

        res.render('detective/answered');
    });

    return router;
};
