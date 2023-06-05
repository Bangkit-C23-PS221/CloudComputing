const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const UserAyamHub = db.define('tb_users', {
    id_user: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        /*field: 'id' //renamed column */
    },
    name: {
        type: DataTypes.STRING,
        required: true,
    },
    password: {
        type: DataTypes.STRING,
        required: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
    },
    phone: {
        type: DataTypes.STRING,
    },
    userLevel: {
        type: DataTypes.STRING,
    },
    refresh_token:{
        type: DataTypes.TEXT,
    }
}, {
    freezeTableName: true
});

module.exports = UserAyamHub;
