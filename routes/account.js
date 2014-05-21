var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/Login', function(req, res) {
    res.render('Account/login', {
        title: 'Login',
        message:''
    });
});
router.get('/Register', function(req, res) {
    res.render('Account/register', {
        title: 'Register',
        message:''
    });
});
module.exports = router;