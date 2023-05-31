import { Sequelize } from "sequelize";
import db from "../config/database.js";
import UserAyamHub from "./userModels.js";

const { DataTypes } = Sequelize;

const Farms = db.define('tb_farms', {
    id_farm: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        /*field: 'id' //renamed column */
    },
    id_user: {
        type: DataTypes.INTEGER(11),
        references: {
            model: UserAyamHub,
            key: 'id_user',
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        }
    },
    name_farm: {
        type: DataTypes.STRING,
        unique: true,
        required: true,
    },
    type_chicken: {
        type: DataTypes.STRING,
    },
    price_chicken: {
        type: DataTypes.STRING,
    },
    age_chicken: {
        type: DataTypes.DATE,
    },
    weight_chicken: {
        type: DataTypes.CHAR,
    },
    stock_chicken: {
        type: DataTypes.CHAR,
    },
    desc_farm: {
        type: DataTypes.STRING,
    },
    address_farm: {
        type: DataTypes.STRING,
    },
    pic_farm: {
        type: DataTypes.BLOB,
    },
    status: {
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true
});

Farms.belongsTo(UserAyamHub, { foreignKey: 'id_user', onDelete: 'NO ACTION', onUpdate: 'CASCADE' });

export default Farms;
