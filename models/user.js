var db = require('../models/index.js');
var Sequelize = require('sequelize');

function init(seq) {
    var User = seq.define('User', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        hometown: Sequelize.STRING
    });
    var UserLogins = seq.define('UserLogins', {
        providerkey: Sequelize.STRING,
        loginprovider: Sequelize.STRING
    }, {
        timestamps: false
    });
    var UserClaims = seq.define('UserClaims', {
        claimtype: Sequelize.STRING,
        claimvalue: Sequelize.STRING
    }, {
        timestamps: false
    });
    User.hasMany(UserLogins);
    UserLogins.belongsTo(User);
    User.hasMany(UserClaims);
    UserClaims.belongsTo(User);

    seq.authenticate()
        .complete(function(err) {
            if ( !! err) {
                console.log('Connection cannot be attached', err);
            } else {
                console.log('Connection to db establised successfully');
            }
        });

    seq.sync({
        force: true
    })
        .complete(function(err) {
            if ( !! err) {
                console.log('Model syncing error', err);
            } else {
                console.log('Action completed');
            }
        });

    return User;
}

module.exports.Create = function(username, password) {
    var users = init(seq);

    var action = users.create({
        username: username,
        password: password
    }).complete(function(err, user) {
        console.log('User created');
        return user;
    });

    this.Run(action);
}

module.exports.FindByEmail = function(givenEmail, givenPassword) {
    var users = init(db.seq);

    users.find({
        where: Sequelize.and({
            email: givenEmail
        }, {
            password: givenPassword
        })
    }).complete(function(err, user) {
        if ( !! err) {
            console.log(err);
        } else if (!user) {
            console.log('no user found');
            return null;
        } else {
            console.log('user found');
            return user;
        }
    });
}

module.exports.FindById = function(givenId) {
    var users = init(seq);

    users.find({
        where: {
            id: givenId
        }
    }).success(function(user) {
        return user;
    });
}