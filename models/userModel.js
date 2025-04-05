const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    userid: {
        type: String,
        default: ""
    },
    designation: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    }
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
