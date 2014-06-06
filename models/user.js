var Sequelize = require('sequelize');
var seq = new Sequelize('mysql://b1aba4b5e9e72f:b33e1d07@us-cdbr-azure-west-a.cloudapp.net/ContosoCarDb', {
    dialect: "mysql",
    port: 3306,
});

module.exports.init = function(seq) {
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
        force: true
    });

    return User;
}