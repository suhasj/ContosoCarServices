var ConnectRoles = require('connect-roles');
var authorization = new ConnectRoles({
    failureHandler: function(req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
        var accept = req.headers.accept || '';
        res.status(403);
        if (~accept.indexOf('html')) {
            if (req.isAuthenticated()) {
                res.redirect('AccessDenied');
            } else {
                res.redirect('/Account/Login');
            }

        } else {
            res.send('Access Denied - You don\'t have permission to: ' + action);
        }
    }
});

authorization.use('view inventory home', function(req) {

    var userClaims = req.currentUser.userClaims;

    for (i = 0; i < userClaims.length; i++) {
        if ((userClaims[i].claimtype == "ProductOperation") && (userClaims[i].claimvalue != "NoAccess")) {
            return true;
        }
    }

    return false;
})

authorization.use('Admin', function(req) {

    var userClaims = req.currentUser.userClaims;

    for (i = 0; i < userClaims.length; i++) {
        if ((userClaims[i].claimtype == "ProductOperationRole") && (userClaims[i].claimvalue == "Admin")) {
            return true;
        }
    }

    return false;
})

authorization.use('Authenticated', function(req) {
    if (!req.isAuthenticated()) {
        return false;
    }

    return true;
});

module.exports.Authorize = authorization;