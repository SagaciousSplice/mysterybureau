const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create Schema - VALIDATION
let OrderSchema = new mongoose.Schema({
    mystery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mystery'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
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
    }
    //going to need to add a lot of data here
});

// methods ======================
// generating a hash
OrderSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
OrderSchema.methods.validPassword = (customer, password) => {
    // console.log('this: ' + this);
    // console.log('passed password: ' + password);
    // console.log('local password: ' + customer.password);
    return bcrypt.compareSync(password, customer.password);
};

module.exports = mongoose.model('Customer', OrderSchema);
