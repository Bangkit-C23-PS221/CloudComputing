import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Farms = db.define('tb_farms', {
    id_farm: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        /*field: 'id' //renamed column */
    },
    id_user: {
        type: DataTypes.STRING,
    },
    username_farm: {
        type: DataTypes.STRING,
    },
    type_chicken: {
        type: DataTypes.STRING,
    },
    price_chicken: {
        type: DataTypes.STRING,
    },
    age_chicken: {
        type: DataTypes.STRING,
    },
    weight_chicken: {
        type: DataTypes.STRING,
    },
    stock_chicken: {
        type: DataTypes.STRING,
    },
    desc_farm: {
        type: DataTypes.STRING,
    },
    address_farm: {
        type: DataTypes.STRING,
    },
    pic_farm: {
        type: DataTypes.STRING,
    },
    longtitude: {
        type: DataTypes.STRING,
    },
    latitude: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true
});

export default Farms;
