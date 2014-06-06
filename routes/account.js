var express = require('express');
var router = express.Router();
var passport = require('passport');

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
    successRedirect: '/Account/loginSuccess',
    failureRedirect: '/Account/Login?q=NotFound'
}));

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