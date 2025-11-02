const Sequelize = require("sequelize");


const db = new Sequelize(
    process.env.MYSQL_ADDON_DB,
    process.env.MYSQL_ADDON_USER,
    process.env.MYSQL_ADDON_PASSWORD,
    {
        host: process.env.MYSQL_ADDON_HOST ,
        port: process.env.MYSQL_ADDON_PORT,
        dialect: "mysql",
        logging: console.log,
    }
)

module.exports = db;