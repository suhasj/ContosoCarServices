var Sequelize = require('sequelize');
var Constants = require('../config/constants.js');
var bcrypt = require('bcrypt-nodejs');
var uuid = require('node-uuid');

function init(seq) {
    var User = seq.define('Users', {
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [6, 100],
                    msg: 'Password should be greater than 6 letters'
                },
                notEmpty: false
            }
        },
        hometown: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: "Hometown cannot be null"
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Not a valid email address'
                }
            }
        },
        totpKey: {
            type: Sequelize.STRING,
            unique: true
        },
        twoFactorEnabled: {
            type: Sequelize.BOOLEAN
        },
        accountLockoutEnabled: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        numberOfAttempts: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        lockoutWindow: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
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

    var objs = [User, UserLogins, UserClaims];

    return objs;
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
    var users = init(Constants.seq)[0];

    var user = users.create({
        username: givenusername,
        email: givenusername,
        password: HashPassword(givenpassword),
        hometown: givenhometown
    }).success(function(user) {
        console.log('User created');
        action(user, null);
    }).error(function(err) {
        action(null, err);
    })
}

module.exports.CreateWithLogin = function(givenusername, givenhometown, loginprovider, providerkey, action) {
    var objs = init(Constants.seq);
    var users = objs[0];
    var userlogins = objs[1];

    users.create({
        username: givenusername,
        email: givenusername,
        hometown: givenhometown,
        password: HashPassword('ASP+Rocks4U')
    }).success(function(user) {
        console.log('User created');
        var userlogin = userlogins.create({
            providerkey: providerkey,
            loginprovider: loginprovider
        }).success(function(createdlogin) {
            user.setUserLogins([createdlogin]).success(function() {
                Constants.seq.sync();
                action(user, null);
            });
        })
    }).error(function(err) {
        action(null, err);
    })
}

module.exports.GetTotpKeyForUser = function(userId, action) {
    var users = init(Constants.seq)[0];

    users.find({
        where: {
            id: userId
        }
    }).success(function(user) {
        if (!user.totpKey) {
            var key = uuid.v4();
            user.totpKey = key;
            user.save().success(function() {
                action(key, null);
            })
        } else {
            action(user.totpKey, null);
        }
    }).error(function(err) {
        action(null, err);
    });

}

module.exports.GetUserById = function(userId, action) {
    var users = init(Constants.seq)[0];

    users.find({
        where: {
            id: userId
        }
    }).success(function(user) {
        action(user, null)
    }).error(function(err) {
        action(null, err);
    });
}