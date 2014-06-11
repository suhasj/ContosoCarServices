var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (req.isAuthenticated()) {
        res.render('index', {
            title: 'Constoso Car Services',
            isAuthenticated: true,
            username: req.user.username
        });
    } else {
        res.render('index', {
            title: 'Constoso Car Services',
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

module.exports = router;