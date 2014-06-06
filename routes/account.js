var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserModel = require('../models/user.js');

/* GET users listing. */
router.get('/Login', function(req, res) {
    var msg = "";
    if (req.query.q == "NotFound") {
        msg = "User not found";
    }
    res.render('Account/login', {
        title: 'Login',
        message: msg
    });
});

router.post('/Login', passport.authenticate('local-login', {
    successRedirect: '/Home',
    failureRedirect: '/Account/Login?q=NotFound'
}));

router.get('/loginFailure', function(req, res, next) {
    res.send('Failed to authenticate');
});



router.get('/Register', function(req, res) {
    var msg = "";

    if (req.query.q == "CreateFailed") {
        msg = "Cannot create user. Please try again";
    }

    res.render('Account/register', {
        title: 'Register',
        message: msg
    });

});

router.post('/Register', function(req, res) {

    var user = UserModel.Create(req.body.email, req.body.password, req.body.hometown, function(user) {
        if (!user) {
            res.redirect('/Register?q=CreateFailed');
        }

        res.redirect('/Home');
    });


});

module.exports = router;