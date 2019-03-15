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
                    itemOrdinal: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    ],
    price: { type: Number },
    tax: { type: Number }
});

module.exports = mongoose.model('Mystery', MysterySchema);
