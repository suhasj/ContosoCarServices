var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserModel = require('../models/user.js');
var authorize = require('../config/auth.js').Authorize;

/* GET users listing. */
router.get('/Login', function(req, res) {
    var msg = "";

    if (req.query.q == "NotFound") {
        msg = "User not found";
    } else if (req.query.q == "CannotLoginWithFacebook") {
        msg = "Cannot login with Facebook";
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
        username: req.currentUser.username,
        message: msg,
        token: req.csrfToken()
    });
});

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.post('/Login/Facebook', passport.authenticate('facebook', {
    scope: 'email,user_hometown'
}));

// handle the callback after facebook has authenticated the user
router.get('/Login/Facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/Account/Login?q=CannotLoginWithFacebook'
    }));

router.get('/RegisterExternalLogin', function(req, res) {
    if (req.user.id) {
        res.redirect('/');
    }

    res.render('Account/registerexternallogin', {
        title: "Create account",
        useremail: req.user.username,
        token: req.csrfToken(),
        message: ""
    });

});

router.post('Account/registerexternallogin', function(req, res) {
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
                res.render('Account/registerexternallogin', {
                    title: "Create account",
                    useremail: err.message,
                    token: req.csrfToken(),
                    message: msg
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
            res.render('Account/registerexternallogin', {
                title: "Create account",
                useremail: req.user.username,
                token: req.csrfToken(),
                message: msg
            });
        }
    });
});

router.get("/AdminHome", authorize.is('Admin'), function(req, res) {
    res.render('Account/adminhome', {
        title: "Admin page"
    });
});


module.exports = router;