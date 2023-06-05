const { Sequelize } = require("sequelize");
const db = require("../config/database.js");
const UserAyamHub = require("./userModels.js");
const Farms = require("./farmModels.js");

const { DataTypes } = Sequelize;

const Bookmarks = db.define('tb_bookmarks', {
    id_bookmark: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        /*field: 'id' //renamed column */
    },
    id_farm: {
        type: DataTypes.INTEGER(11),
        references: {
            model: Farms,
            key: 'id_farm'
        }
    },
    id_user: {
        type: DataTypes.INTEGER(11),
        references: {
            model: UserAyamHub,
            key: 'id_user'
        }
    }
}, {
    freezeTableName: true
});

Bookmarks.belongsTo(Farms, { foreignKey: 'id_farm' });
Bookmarks.belongsTo(UserAyamHub, { foreignKey: 'id_user' });

module.exports = Bookmarks;
