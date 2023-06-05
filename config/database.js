const { Sequelize } = require("sequelize");

const db = new Sequelize('db_ayamhub', 'root', 'ayamhub', {
    host: "34.101.63.36",
    dialect: "mysql"
})

module.exports = db;
