const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    email: String,
    password: String
   
});

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;