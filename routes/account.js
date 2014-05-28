var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/Login', function(req, res) {
    res.render('Account/login', {
        title: 'Login',
        message: ''
    });
});

router.post('/Login', function(req, res) {
    passport.authenticate('local-login', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginFailure'
    });
});

router.get('/loginFailure', function(req, res, next) {
    res.send('Failed to authenticate');
});

router.get('/loginSuccess', function(req, res, next) {
    res.send('Successfully authenticated');
});

router.get('/Register', function(req, res) {
    res.render('Account/register', {
        title: 'Register',
        message: ''
    });
});

module.exports = router;