const mongoose = require('mongoose');
const validate = require('mongoose-validator');

//Create Schema - VALIDATION
let MysterySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    events: [
        {
            event: {
                type: String,
                required: true
            },
            eventNumber: {
                type: Number,
                required: true
            },
            clues: [
                {
                    item: {
                        type: String,
                        required: true
                    },
                    image: {
                        type: String,
                        required: true
                    },
                    imageAlt: {
                        type: String,
                        required: true
                    },
                    itemOrdinal: {
                        type: Number,
                        required: true
                    }
                }
            ],
            questions: [
                {
                    question: {
                        type: String,
                        required: true
                    }
                }
            ],
            //Status can be: notYet (1-event not begun), mailed (2-event mailed out), started (3-logged in to event), or finished (4-event questions submitted)
            status: {
                type: String,
                required: true,
                default: 'notYet'
            }
        }
    ],
    image: {
        type: String,
        required: true
    },
    imageAlt: {
        type: String,
        required: true
    },
    subscriptionURL: {
        type: String,
        required: true
    },
    subscriptionID: {
        type: String,
        required: true
    },
    price: { type: Number },
    tax: { type: Number }
});

module.exports = mongoose.model('Mystery', MysterySchema);
