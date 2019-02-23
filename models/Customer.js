const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

//Create Schema - VALIDATION
let CustomerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate: [
            validate({
                validator: 'isEmail',
                message: 'Not a valid email.'
            })
        ]
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String
        // required: true
    },
    lastName: {
        type: String
        // required: true
    },
    address1: {
        type: String
        // required: true
    },
    address2: {
        type: String
    },
    city: {
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
    postalZip: {
        type: String
        // required: true
    },
    profilePicture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProfilePicture'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        default: 'customer'
    }
});

// methods ======================
// generating a hash
CustomerSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
CustomerSchema.methods.validPassword = (customer, password) => {
    // console.log('this: ' + this);
    // console.log('passed password: ' + password);
    // console.log('local password: ' + customer.password);
    return bcrypt.compareSync(password, customer.password);
};

module.exports = mongoose.model('Customer', CustomerSchema);
