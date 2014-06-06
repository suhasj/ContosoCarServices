var Sequelize = require('sequelize');
var Constants = require('../config/constants.js');
var bcrypt = require('bcrypt-nodejs');

function init(seq) {
    var User = seq.define('Users', {
        username: Sequelize.STRING,
        password: Sequelize.STRING,
        hometown: Sequelize.STRING,
        email: Sequelize.STRING
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

    seq.authenticate();

    seq.sync({
        force: false
    });

    return User;
}

function HashPassword(password) {
    var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

module.exports.ComparePassword = function(givePassword, actualPassword) {

    return bcrypt.compareSync(givePassword, actualPassword);
}

module.exports.Setup = function() {
    return init(Constants.seq);
}

module.exports.Create = function(givenusername, givenpassword, givenhometown, action) {
    var users = init(Constants.seq);

    var user = users.create({
        username: givenusername,
        email: givenusername,
        password: HashPassword(givenpassword),
        hometown: givenhometown
    }).success(function(user) {
        console.log('User created');
        action(user);
    })

    return user;
}