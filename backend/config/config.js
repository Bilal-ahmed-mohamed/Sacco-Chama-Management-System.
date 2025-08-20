const Sequelize = require("sequelize");

const db = new Sequelize("Chama", "root", "" ,{
    host : "localhost",
    dialect : "mysql",
    logging: console.log
});


module.exports = db;