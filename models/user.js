//require Mongoose
var mongoose = require('mongoose');

var user = mongoose.Schema({
    name:String,
    image:String,
    email:String,
    password:String,
    phone:String,
    role:Number
});

module.exports = mongoose.model('user', user);