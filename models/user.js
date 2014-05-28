var db = require('../models/index.js');

module.exports.init = function() {
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

    return User;
}

module.exports.Create = function(username, password) {
    var users = User.init(seq, Sequelize);

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
    var users = User.init(seq, Sequelize);

    users.find({
        where: Sequelize.and({
            email: givenEmail
        }, {
            password: givenPassword
        })
    }).success(function(user) {
        return user;
    });
}

module.exports.FindById = function(givenId) {
    var users = User.init(seq, Sequelize);

    users.find({
        where: {
            id: givenId
        }
    }).success(function(user) {
        return user;
    });
}