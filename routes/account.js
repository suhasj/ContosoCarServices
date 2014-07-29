var express = require('express');
var router = express.Router();
var passport = require('passport');
var UserModel = require('../models/user.js');
var authorize = require('../config/auth.js').Authorize;
var MessageDictionary = require('../config/errorMsg.js').MessageDictionary;
var base32 = require('thirty-two');

/* GET users listing. */
router.get('/Login', function(req, res) {
    var msg = MessageDictionary[req.query.q] == undefined ? "" : MessageDictionary[req.query.q];

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

router.post('/Login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/Account/Login?q=' + info.result);
        }
        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/Account/EnterCode');
        });
    })(req, res, next);
});


router.get('/Register', function(req, res) {
    var msg = MessageDictionary[req.query.q] == undefined ? "" : MessageDictionary[req.query.q];

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

router.get("/AddAuthenticator", function(req, res) {
    UserModel.GetTotpKeyForUser(req.currentUser.id, function(key, err) {
        if (err) {
            return next(err);
        }
        if (key) {
            // two-factor auth has already been setup
            var encodedKey = base32.encode(key);

            // generate QR code for scanning into Google Authenticator
            // reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat
            var otpUrl = 'otpauth://totp/' + req.currentUser.username + '?secret=' + encodedKey;
            var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);

            res.render('Account/totpsetup', {
                token: req.csrfToken(),
                key: encodedKey,
                qrImage: qrImage,
                title: "Add Authenticator",
                message: ""
            });
        }
    });
});

router.post("/AddAuthenticator", authorize.is('Authenticated'),
    passport.authenticate('totp', {
        failureRedirect: '/Account/AddAuthenticator?q=InvalidCode'
    }), function(req, res) {
        res.redirect('/');
    });

router.get("/EnterCode", authorize.is('Authenticated'), function(req, res) {
    if (!req.currentUser.twoFactorEnabled) {
        res.redirect('/');
    } else {
        var user = UserModel.GetUserById(req.currentUser.id, function(user, err) {
            res.render('Account/login-otp', {
                token: req.csrfToken(),
                title: "Enter Code",
                message: ""
            });
        });
    }
});

router.post("/EnterCode", authorize.is('Authenticated'),
    passport.authenticate('totp', {
        failureRedirect: '/Account/EnterCode'
    }), function(req, res) {
        req.session.authFactors = ['totp'];
        res.redirect('/');
    });

module.exports = router;