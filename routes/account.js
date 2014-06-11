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
        message: msg,
        token: req.csrfToken()
    });
});

router.get("/Logout", function(req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/Login', passport.authenticate('local-login', {
    successRedirect: '/',
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
        message: msg,
        token: req.csrfToken()
    });

});

router.post('/Register', function(req, res) {

    var user = UserModel.Create(req.body.email, req.body.password, req.body.hometown, function(user, err) {
        if (user) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                // login success!
                res.redirect('/'); // or whereever
            });
        } else {

            if (err.hasOwnProperty('message')) {
                console.log(err.message);
                // Redirect to Register page with errors
                res.render('Account/register', {
                    title: 'Register',
                    message: err.message,
                    token: req.csrfToken()
                });

                return;
            }

            var msg = '';

            var keys = [
                'email',
                'password',
                'username',
                'hometown'
            ];

            for (var i = 0; i < keys.length; i++) {
                if (err.hasOwnProperty(keys[i])) {
                    msg += err[keys[i]].toString();
                    msg += ";";
                }
            }

            // Redirect to Register page with errors
            res.render('Account/register', {
                title: 'Register',
                message: msg,
                token: req.csrfToken()
            });
        }

    });
});

router.get('/Manage', function(req, res) {
    if (!req.isAuthenticated()) {
        res.redirect("/Account/Login");
        return;
    }
    var msg = "";
    res.render('Account/manage', {
        title: "Manage",
        username: req.user.username,
        message: msg,
        token: req.csrfToken()
    });
});

module.exports = router;