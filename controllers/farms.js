import Farms from "../models/farmModels.js";
import UserAyamHub from "../models/userModels.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

export const getAllFarms = async(req, res) => {
    try {
        const user = await Farms.findAll({
            attributes: ['id_farm', 'name_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'photo', 'photo_url', 'status' ]
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const createFarms = async(req, res) => {
    const{name_farm, type_chicken, price_chicken, age_chicken, weight_chicken, stock_chicken, desc_farm, address_farm, status} = req.body;
    const { id_user } = req.params;

    if(req.files === null) {
        return res.status(400).json({message: "Belum ada foto yang diupload"});
    }
    const photo = req.files.photo;
    const fileSize = photo.data.length;
    const ext = path.extname(photo.name);
    const fileName = photo.md5 + ext;
    const photo_url = `${req.protocol}://${req.get("host")}/images/farm-photos/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];
    
    // Check if id_user exists in tb_users
    const existingUser = await UserAyamHub.findOne({ 
        where: { id_user: id_user } 
    });
    if (!existingUser) {
    return res.status(400).json({ message: "Pengguna tidak ditemukan" });
    }
    // Check if name already exists
    const existingNameFarms = await Farms.findOne({ 
        where: { name_farm: name_farm } 
    });

    if (existingNameFarms) {
    return res.status(400).json({ message: "Nama peternakan telah terdaftar, tolong gunakan nama lain" });
    }

    // Check if photo uploaded didn't suit with the required type
    if(!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({message: "Tolong upload foto dengan format .png/.jpeg/.jpg"});
    }
    if(fileSize > 5000000) {
        return resizeTo.status(422).json({message: "Maksimum ukuran gambar hanya 5 MB"});
    }

    //Then create a new farms
    photo.mv(`./public/images/farm-photos/${fileName}`, async(err) => {
        if(err) return res.status(500).json({message: err.message});
        try {
            await Farms.create({
            id_user: id_user,
            name_farm: name_farm,
            type_chicken: type_chicken,
            price_chicken: price_chicken,
            age_chicken: age_chicken,
            weight_chicken: weight_chicken,
            stock_chicken: stock_chicken,
            desc_farm: desc_farm,
            address_farm: address_farm,
            photo: fileName,
            photo_url: photo_url,
            status: status
            });
            // Update userLevel to true in tb_users
            await UserAyamHub.update(
                { userLevel: "farm" },
                { where: { id_user: id_user } }
            );
            res.status(200).json({message: "Peternakan berhasil ditambahkan"});
        } catch (error) {
            console.log(error);
        res.status(500).json({ message: "Peternakan gagal ditambahkan" });
        }
    })
}

export const loginFarms = async(req, res) => {
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

export const updateFarms = async(req, res) => {
    const { id_farm } = req.params;

    // Check if farms exist
    const existingFarms = await Farms.findOne({
        where: {
            id_farm: id_farm
        }
    });
    if(!existingFarms){
        return res.status(400).json({message: "Data peternakan tidak ditemukan"});
    }
    // If update without photo
    let fileName = "";
    if(req.files === null) {
        fileName = Farms.photo;
    } else {// If update with photo
        const photo = req.files.photo;
        const fileSize = photo.data.length;
        const ext = path.extname(photo.name);
        fileName = photo.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        // Check if photo uploaded didn't suit with the required type
        if(!allowedType.includes(ext.toLowerCase())) {
            return res.status(422).json({message: "Tolong upload foto dengan format .png/.jpeg/.jpg"});
        }
        if(fileSize > 5000000) {
            return resizeTo.status(422).json({message: "Maksimum ukuran gambar hanya 5 MB"});
        }
        // Delete old photo
        const photoPath = `./public/images/farm-photos/${existingFarms.photo}`;
        try {
            await fs.promises.unlink(photoPath);
        } catch (err) {
            console.error(err);
        }

        // Change with new photo
        try {
            await photo.mv(`./public/images/farm-photos/${fileName}`);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    const{name_farm, type_chicken, price_chicken, age_chicken, weight_chicken, stock_chicken, desc_farm, address_farm, status} = req.body;
    const photo_url = `${req.protocol}://${req.get("host")}/images/farm-photos/${fileName}`;
    try {
        // Check if name already exists
        const existingNameFarms = await Farms.findOne({ 
            where: {
                name_farm: name_farm,
                id_farm: { [Op.ne]: id_farm }, //Keeping the name if nothing changes so that the other fields can be updated
            }
        });
        if (existingNameFarms) {
            return res.status(400).json({ message: "Nama peternakan telah terdaftar, tolong gunakan nama lain" });
        }
        //Update farms data
        await Farms.update({
            name_farm: name_farm,
            type_chicken: type_chicken,
            price_chicken: price_chicken,
            age_chicken: age_chicken,
            weight_chicken: weight_chicken,
            stock_chicken: stock_chicken,
            desc_farm: desc_farm,
            address_farm: address_farm,
            photo: fileName,
            photo_url: photo_url,
            status: status
        },
        { 
            where: { id_farm: id_farm } 
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

    try {
        // Delete photo with fileSystem
        const photoPath = `./public/images/farm-photos/${existingFarms.photo}`;
        fs.unlinkSync(photoPath);
        // Delete farms
        await Farms.destroy({
            where:{
                id_farm: id_farm,
                id_user: id_user
            }
        });
        await UserAyamHub.update(
            { userLevel: "umkm" },
            { where: { id_user: id_user } }
        );
        res.json({message: "Data peternakan berhasil dihapus"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Data peternakan gagal dihapus"})
    }
}
