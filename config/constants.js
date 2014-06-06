var Sequelize = require('sequelize');
// Configure database connection
module.exports.seq = new Sequelize('mysql://b1aba4b5e9e72f:b33e1d07@us-cdbr-azure-west-a.cloudapp.net/ContosoCarDb', {
    dialect: "mysql",
    port: 3306,
});