var express = require('express');
var router = express.Router();
var user = require('../config/auth.js').Authorize;

router.get("/", user.can('view inventory home'), function(req, res) {
    res.render('Inventory/index', {
        title: "Inventory Home"
    });
});

router.get("/AddProduct", user.is('Admin'), function(req, res) {
    res.render('Inventory/addmodel', {
        title: "Add Model Home"
    });
});

module.exports = router;