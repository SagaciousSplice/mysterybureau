const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create Schema - VALIDATION
let OrderSchema = new mongoose.Schema({
    mystery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mystery',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    isSpecialDelivery: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String
        //required: true
    },
    lastName: {
        type: String
        //required: true
    },
    address1: {
        type: String
        //required: true
    },
    address2: {
        type: String
    },
    country: {
        type: String
        // required: true
    },
    city: {
        type: String
        // required: true
    },
    stateProv: {
        type: String
        // required: true
    },
    provState: {
        type: String
        // required: true
    },
    country: {
        type: String
        //required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        default: 'detective'
    },
    secretName: {
        type: String,
        default: 'No Code Name Applied',
        required: true
    },
    secretCode: {
        type: String,
        default: 'No Secret Code Created',
        required: true
    },
    orderComplete: {
        type: Boolean,
        default: false
    },
    numberEvents: { type: Number, status: String },
    previousEvent: { type: Number, status: String },
    currentEvent: {
        type: Number,
        default: 1,
        status: String
    },
    nextEvent: { type: Number, status: String },
    questions: [
        {
            type: String
        }
    ],
    answers: [
        {
            type: String
        }
    ],
    mysteryCompleted: {
        type: Boolean,
        default: false
    }

    //going to need to add a lot of data here
});

// checking if password is valid
OrderSchema.methods.validSecretCode = (order, secretName, secretCode) => {
    return secretCode === order.secretCode && secretName === order.secretName;
};

module.exports = mongoose.model('Order', OrderSchema);
