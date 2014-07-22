var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        res.render('index', {
            title: 'Constoso Car Services',
            isAuthenticated: true,
            username: req.currentUser.username,
            hometown: req.currentUser.hometown
        });
    } else {
        res.render('index', {
            title: 'Constoso Car Services',
            isAuthenticated: false,
            name: 'Foo'
        });
    }

});

router.get('/redirect', function(req, res) {
    res.render('redirect', {
        title: 'Express',
        name: 'Foo'
    });
});

router.get('/Home', function(req, res, next) {
    res.render('index', {
        title: 'Constoso Car Services',
        isAuthenticated: true
    });
});

router.get('/AccessDenied', function(req, res, next) {
    res.render('access-denied', {
        message: 'User does not have enough rights to view page',
        isAuthenticated: true
    });
});

module.exports = router;