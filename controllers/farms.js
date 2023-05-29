import Farms from "../models/farmModels.js";
import UserAyamHub from "../models/usersModels.js";
import { Op } from "sequelize";

export const getFarms = async(req, res) => {
    try {
        const user = await Farms.findAll({
            attributes: ['username_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'pic_farm', 'status' ]
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const createFarms = async(req, res) => {
    const{username_farm, type_chicken, price_chicken, age_chicken, weight_chicken, stock_chicken, desc_farm, address_farm, pic_farm, longtitude, latitude, status} = req.body;
    const { id_user } = req.params;

    try {
        // Check if id_user exists in tb_users
        const existingUser = await UserAyamHub.findOne({ 
            where: { id_user: id_user } 
        });
        if (!existingUser) {
        return res.status(400).json({ message: "Pengguna tidak ditemukan" });
        }
        // Check if username already exists
        const existingUsernameFarms = await Farms.findOne({ 
            where: { username_farm: username_farm } 
        });

        if (existingUsernameFarms) {
        return res.status(400).json({ message: "Nama peternakan telah terdaftar, tolong gunakan nama lain" });
        }

        // Then, create a new farms
        await Farms.create({
            id_user: id_user,
            username_farm: username_farm,
            type_chicken: type_chicken,
            price_chicken: price_chicken,
            age_chicken: age_chicken,
            weight_chicken: weight_chicken,
            stock_chicken: stock_chicken,
            desc_farm: desc_farm,
            address_farm: address_farm,
            pic_farm: pic_farm,
            longtitude: longtitude,
            latitude: latitude,
            status: status
        });
        // Update isFarm to true in tb_users
        await UserAyamHub.update(
            { isFarm: true },
            { where: { id_user: id_user } }
        );

        res.json({message: "Peternakan berhasil ditambahkan"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal menambahkan peternakan" });
    }
}

export const LoginFarms = async(req, res) => {
    const { id_user } = req.params;
    try {
        // Find the farm based on id_user
        const farm = await Farms.findOne({
            where: {
                id_user: id_user
            }
        });
        if (farm) {
            res.json({ id_farm: farm.id_farm, id_user: farm.id_user, message: "Login peternakan berhasil" });
        } else {
            res.status(404).json({ message: "Pengguna tidak memiliki peternakan yang terdaftar" });
        }
    } catch (error) {
        res.status(404).json({message: "Login peternakan gagal"});
    }
}

export const UpdateFarms = async(req, res) => {
    const{username_farm, type_chicken, price_chicken, age_chicken, weight_chicken, stock_chicken, desc_farm, address_farm, pic_farm, longtitude, latitude, status} = req.body;
    const { id_farm, id_user } = req.params;

    try {
        // Check if username already exists
        const existingUsernameFarms = await Farms.findOne({ 
            where: {
                username_farm: username_farm,
                id_farm: { [Op.ne]: id_farm }, //Keeping the username if nothing changes so that the other fields can be updated
                id_user: id_user
            }
        });
        if (existingUsernameFarms) {
        return res.status(400).json({ message: "Nama peternakan telah terdaftar, tolong gunakan nama lain" });
        }

        //Update farms data
        await Farms.update({
            username_farm: username_farm,
            type_chicken: type_chicken,
            price_chicken: price_chicken,
            age_chicken: age_chicken,
            weight_chicken: weight_chicken,
            stock_chicken: stock_chicken,
            desc_farm: desc_farm,
            address_farm: address_farm,
            pic_farm: pic_farm,
            longtitude: longtitude,
            latitude: latitude,
            status: status
        },
        { 
            where: { id_farm: id_farm, id_user: id_user} 
        }
        );
        res.json({message: "Data peternakan berhasil diperbarui"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Data peternakan gagal diperbarui"});
    }

}

export const deleteFarms = async(req, res) => {
    const { id_farm, id_user } = req.params;

    try {
        // Check if farms exist
        const existingFarms = await Farms.findOne({
            where: {
                id_farm: id_farm,
                id_user: id_user
            }
        });
        if(!existingFarms){
            return res.status(400).json({message: "Data peternakan tidak ditemukan"});
        }
        // Delete farms
        await Farms.destroy({
            where:{
                id_farm: id_farm,
                id_user: id_user
            }
        });
        res.json({message: "Data peternakan berhasil dihapus"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Data peternakan gagal dihapus"})
    }
}
