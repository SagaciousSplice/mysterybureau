const mongoose = require('mongoose');
const validate = require('mongoose-validator');

//Create Schema - VALIDATION
let RandomSchema = new mongoose.Schema({
    adjective: { type: String, required: true },
    noun: { type: String, required: true }
});

module.exports = mongoose.model('Random', RandomSchema);
