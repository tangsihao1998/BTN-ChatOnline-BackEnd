const express = require('express');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

// Define Controller
var UserController = require('../controller/ApiUserController');

// User Router
router.post('/register', async (req,res)=>{
    console.log('1')
    const {errors, isValid} = await UserController.validateRegisterInput(req.body);
    console.log('2')
    if(!isValid) {
        return res.status(400).json({
            error: errors,
        });
    }
    console.log('2')
    const CheckUser = await UserController.FindUserByEmail(req.body.email);
    if(CheckUser){
        return res.status(400).json({
            error: {email: 'Email already exists'},
        });
    }
    const newuser ={
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }
    const lastestPW = req.body.password;
    newuser.password = md5(req.body.password);
    let reUSER = await UserController.AddNewUser(newuser);
    if(reUSER){
        return res.json({email: newuser.email, password:lastestPW, username: newuser.name,error:''});
    }
});

// Login 
router.post('/login', async (req,res)=>{
    console.log(req.body);
    const {errors, isValid} = await UserController.validateLoginInput(req.body);
    if(!isValid) {
        return res.status(400).json({
            error: errors, 
        });
    }
    const user = await UserController.FindUserByEmail(req.body.email);
    if(!user){
        return res.status(400).json({
            error: {email:'Your e-mail/password is invalid!'},
        });
    }

    const hashpassword = md5(req.body.password);

    if(hashpassword == user.password){
        const payload = {
            id: user._id,
            image: user.image,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
        };
        jwt.sign(payload,'secret',{expiresIn: 3600},(err,token) => {
            if(err){
                console.log(err);
            }
            else{
                res.json({
                    success: true,
                    token: `${token}`,
                    error: ''
                });
            }
        });
        return res.json;
    }
    return res.status(400).json({
        error: {password:'Your e-mail/password is invalid!'},
    });
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log("complete");
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    });
});


module.exports = router;

