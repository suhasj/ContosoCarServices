var Sequelize = require('sequelize');

var seq = new Sequelize('mysql://b1aba4b5e9e72f:b33e1d07@us-cdbr-azure-west-a.cloudapp.net/ContosoCarDb', {
    dialect: "mysql",
    port: 3306,
});

module.exports.Run = function(action) {
    seq.authenticate()
        .complete(function(err) {
            if ( !! err) {
                console.log('Connection cannot be attached', err);
            } else {
                console.log('Connection to db establised successfully');
            }
        });

    seq.sync({
        force: false
    })
        .complete(function(err) {
            if ( !! err) {
                console.log('Model syncing error', err);
            } else {

                action();

                console.log('Action completed');
            }
        });
}