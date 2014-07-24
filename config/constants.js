var Sequelize = require('sequelize');
// Configure database connection
module.exports.seq = new Sequelize('mysql://b3f11d480d32a2:a09c4670@us-cdbr-azure-west-a.cloudapp.net/ConstosoCarDb', {
    dialect: "mysql",
    port: 3306,
});