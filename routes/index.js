var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Constoso Car Services',
        name: 'Foo'
    });
});

router.get('/redirect', function(req, res) {
    res.render('redirect', {
        title: 'Express',
        name: 'Foo'
    });
});

module.exports = router;