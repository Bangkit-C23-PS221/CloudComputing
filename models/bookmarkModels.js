import { Sequelize } from "sequelize";
import db from "../config/database.js";
import UserAyamHub from "./userModels.js";
import Farms from "./farmModels.js";

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

export default Bookmarks;
