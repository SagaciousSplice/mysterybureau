const mongoose = require('mongoose');
const validate = require('mongoose-validator');

//Create Schema - VALIDATION
let MysterySchema = new mongoose.Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    events: [
        {
            event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
            permissions: [{ type: String }]
        }
    ]
});

module.exports = mongoose.model('Mystery', MysterySchema);
