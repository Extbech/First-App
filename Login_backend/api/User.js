const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User')

// password encryption
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name == "" ||  email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields"
        });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        });
    } else if (!new Date(dateOfBirth).getTime()) {
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        });
    } else  if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password too short"
        })
    } else {
        User.find({email}).then(result => {
            if (result.length) {
                //A user already exist
                res.json({
                    satus: "Failed",
                    message: "User with the provided email already exists"
                })
            } else {
                //try to create a new user
                //Password encryption
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedpassword => {
                    const newUser = new User({
                        name,
                        email,
                        password: hashedpassword,
                        dateOfBirth
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful!",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "an error occured while saving user account"
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "an error occured while hashing the password"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                satus: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
})
//Signin
router.post('/signin', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            satus: "FAILED",
            message: "Empty credentials"
        })
    } else {
        //check if user exist
        User.find({email})
        .then(data => {
            if (data.length) {
                //User exists
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        //password match
                        res.json({
                        status: "SUCCESS",
                        message: "Signin successful",
                        data: data
                    })
                    } else {
                        res.json({
                            satus: "FAILED",
                            message: "Wrong Password"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        satus: "FAILED",
                        message: "Error occured while checking for correct password"
                    })
                })
            } else {
                res.json({
                    satus: "FAILED",
                    message: "Invalid credentials entered"
                })
            }
        })
        .catch(err => {
            res.json({
                satus: "FAILED",
                message: "An error occured while checking for existing user (email)"
            })
        })
        
    }
})

module.exports = router;

