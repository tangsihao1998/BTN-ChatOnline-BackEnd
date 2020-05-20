//Define a Models
const Validator = require('validator');
var Userdata = require('../models/user');
 
let controller ={};

// Validation
const isEmpty = (value) => {
    return (value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}

// Validate Register
controller.validateRegisterInput = async(user) => {
    let errors ={};
    user.name = !isEmpty(user.name) ? user.name: '';
    user.email = !isEmpty(user.email) ? user.email:'';
    user.password = !isEmpty(user.password) ? user.password:'';
    user.phone = !isEmpty(user.phone) ? user.phone:'';
    if(isEmpty(user.name)) {
        errors.name = 'Please enter a valid name';
    }
    if(isEmpty(user.email) || !Validator.isEmail(user.email)) {
        errors.email = 'Please enter a valid e-mail';
    }
    if(isEmpty(user.password) || !Validator.isLength(user.password,{min:6,max:30})) {
        errors.password = 'Your password must be more than 6 characters!';
    }
    if(isEmpty(user.phone) || !Validator.isLength(user.phone,{min:10,max:10})) {
        errors.phone = 'Please enter a valid phone';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

controller.validateLoginInput = async(user) => {
    let errors ={};
    user.email = !isEmpty(user.email) ? user.email:'';
    user.password = !isEmpty(user.password) ? user.password:'';

    if(isEmpty(user.email) || !Validator.isEmail(user.email)) {
        errors.email = 'Your e-mail/password is invalid!';
    }
    if(isEmpty(user.password) || !Validator.isLength(user.password,{min:6,max:30})) {
        errors.password = 'Your e-mail/password is invalid!';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

// Add New User
controller.AddNewUser = async(user) => {
    try {        
        const userinfo = await Userdata.create({name: user.name, phone:user.phone, email: user.email,password: user.password,role: 1,image: '/images/user.png'})
        return userinfo;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Find User By Email 
controller.FindUserByEmail = async(uemail) => {
    try {
        const user = await Userdata.findOne({email: uemail});
        return user; 
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = controller;