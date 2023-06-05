const processFile = require("../middleware/uploadImage.js");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const Farms = require("../models/farmModels.js");
const UserAyamHub = require("../models/userModels.js");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "ayamhub-key.json" });
const bucket = storage.bucket("ayamhub");

exports.getMyFarm = async(req, res) => {
    const { id_user } = req.params;
    try {
        const myfarms = await Farms.findAll({
            where: {
                id_user: id_user
            },
            attributes: ['id_farm', 'name_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'photo', 'photo_url', 'status' ]
        });
        res.json(myfarms);
    } catch (error) {
        console.log(error);
    }
};

exports.getFarmDetails = async (req, res) => {
    const { id_farm } = req.params;
    try {
        const bookmark = await Farms.findOne({
            where: { 
                id_farm: id_farm
            },
            attributes: ['id_farm', 'name_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'photo', 'photo_url', 'status' ],
            include: [
                {
                  model: UserAyamHub,
                  attributes: ['phone'], // Add atribut phone from tb_users
                },
            ],
        });
        // Bookmark not found
        if (!bookmark) {
            return res.status(404).json({ message: 'Peternakan tidak ditemukan' });
        }
        res.json(bookmark);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Gagal menampilkan detail bookmark' });
    }
};

exports.getAllFarms = async(req, res) => {
    try {
        const allfarms = await Farms.findAll({
            attributes: ['id_farm', 'name_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'photo', 'photo_url', 'status' ],
            include: [
                {
                  model: UserAyamHub,
                  attributes: ['phone'], // Add atribut phone from tb_users
                },
            ],
        });
        res.json(allfarms);
    } catch (error) {
        console.log(error);
    }
};

exports.loginFarms = async(req, res) => {
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
};  

exports.createFarms = async(req, res) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    try {
        await processFile(req, res);
        
        if (!req.file) {
            return res.status(400).send({message: "Tolong upload foto peternakan !"});
        }
        // Check file extension
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(`.${fileExtension}`)) {
            return res.status(400).send({ message: "Hanya menerima inputan gambar dengan ekstensi .png / .jpg / .jpeg" });
        }
        //Create a new blob in the bucket ayamhub
        const blob = bucket.file(`farm-photos/${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: req.file.mimetype,
                metadata: {
                    contentDisposition: "inline"
                }
            }
        });
        blobStream.on("error", (err) => {
            res.status(500).send({message: err.message});
        });
        blobStream.on("finish", async (data) => {
            // Create a public URL for online access using http
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        
            const { name_farm, type_chicken, price_chicken, age_chicken, weight_chicken, stock_chicken, desc_farm, address_farm, status } = req.body;
            const { id_user } = req.params;
            try {
                // Check if id_user exist in tb_users
                const existingUser = await UserAyamHub.findOne({
                   where: { id_user: id_user} 
                });
                if (!existingUser) {
                    return res.status(400).json({message: "Pengguna tidak ditemukan"});
                }
                // Check if name_farm already used
                const existingNameFarms = await Farms.findOne({
                   where: { name_farm: name_farm } 
                });
                if(existingNameFarms) {
                    return res.status(400).json({message: "Nama peternakan telah terdaftar, tolong gunakan nama lain"});
                }
                
                // Create the new Farm record in database
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
                    photo: req.file.originalname,
                    photo_url: publicUrl,
                    status: status
                });
                // Update userlevel to true in tb_users
                await UserAyamHub.update(
                  { userLevel: "farm" },
                  { where: { id_user: id_user }}  
                );

                res.status(200).json({message: "Peternakan berhasil ditambahkan"});
            } catch (err) {
                //Delete the uploaded file if database save fails
                await blob.delete();
                res.status(500).send({
                    message: `Could not create the record: ${req.file.originalname}. ${err}`
                });
            }
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        if(error.code == "LIMIT_FILE_SIZE"){
            return res.status(500).send({
                message: "File size cannot be larger than 5 MB!"
            });
        }
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`
        });
    }
};

exports.updateFarms = async (req, res) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    try {
        await processFile(req, res);

        const { id_user } = req.params;
        const { name_farm, type_chicken, price_chicken, age_chicken, weight_chicken, stock_chicken, desc_farm, address_farm, status } = req.body;
        let urlImages = null;

        if (req.file) {
            // Check file extension
            const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(`.${fileExtension}`)) {
                return res.status(400).send({ message: "Hanya menerima inputan gambar dengan ekstensi .png / .jpg / .jpeg" });
            }

            // Create a new blob in the bucket
            const blob = bucket.file(`farm-photos/${req.file.originalname}`);
            const blobStream = blob.createWriteStream({
                resumable: false,
                metadata: {
                    contentType: req.file.mimetype,
                    metadata: {
                        contentDisposition: "inline"
                    }
                }
            });
            blobStream.on("error", (err) => {
                res.status(500).send({ message: err.message });
            });
            blobStream.on("finish", async (data) => {
                // Create a public URL for online access using http
                urlImages = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                try {
                    // Find the existing farm
                    const existingFarm = await Farms.findOne({
                        where: { id_user: id_user }
                    });
                    if (!existingFarm) {
                        return res.status(400).json({ message: "Peternakan tidak ditemukan" });
                    }
                    // Check if name already exists
                    const existingNameFarms = await Farms.findOne({ 
                        where: {
                            name_farm: name_farm,
                            id_user: { [Op.ne]: id_user }, //Keeping the name if nothing changes so that the other fields can be updated
                        }
                    });
                    if (existingNameFarms) {
                        return res.status(400).json({ message: "Nama peternakan telah terdaftar, tolong gunakan nama lain" });
                    }

                    // Delete the old photo from cloud storage
                    if (existingFarm.photo_url) {
                        const oldPhotoName = existingFarm.photo_url.split("/").pop();
                        const oldPhotoBlob = bucket.file(`farm-photos/${oldPhotoName}`);
                        await oldPhotoBlob.delete();
                    }

                    // Update the farm record in the database
                    await existingFarm.update({
                        name_farm: name_farm,
                        type_chicken: type_chicken,
                        price_chicken: price_chicken,
                        age_chicken: age_chicken,
                        weight_chicken: weight_chicken,
                        stock_chicken: stock_chicken,
                        desc_farm: desc_farm,
                        address_farm: address_farm,
                        photo: req.file.originalname,
                        photo_url: urlImages,
                        status: status
                    });

                    res.status(200).json({ message: "Peternakan berhasil diperbarui" });
                } catch (err) {
                    // Delete the uploaded file if database update fails
                    await blob.delete();
                    res.status(500).send({
                        message: `Could not update the record: ${req.file.originalname}. ${err}`
                    });
                }
            });

            blobStream.end(req.file.buffer);
        } else {
            try {
                // Find the existing farm
                const existingFarm = await Farms.findOne({
                    where: { id_user: id_user }
                });

                if (!existingFarm) {
                    return res.status(400).json({ message: "Peternakan tidak ditemukan" });
                }
                // Check if name already exists
                const existingNameFarms = await Farms.findOne({ 
                    where: {
                        name_farm: name_farm,
                        id_user: { [Op.ne]: id_user }, //Keeping the name if nothing changes so that the other fields can be updated
                    }
                });
                if (existingNameFarms) {
                    return res.status(400).json({ message: "Nama peternakan telah terdaftar, tolong gunakan nama lain" });
                }
                // Update the farm record in the database without changing the photo
                await existingFarm.update({
                    name_farm: name_farm,
                    type_chicken: type_chicken,
                    price_chicken: price_chicken,
                    age_chicken: age_chicken,
                    weight_chicken: weight_chicken,
                    stock_chicken: stock_chicken,
                    desc_farm: desc_farm,
                    address_farm: address_farm,
                    status: status
                });

                res.status(200).json({ message: "Peternakan berhasil diperbarui" });
            } catch (err) {
                res.status(500).send({
                    message: `Could not update the record. ${err}`
                });
            }
        }
    } catch (error) {
        if (error.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "File size cannot be larger than 5 MB!"
            });
        }

        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`
        });
    }
};

exports.deleteFarms = async(req, res) => {
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
        // Delete farm's photo in cloud storage
        if (existingFarms.photo_url) {
            const photoName = existingFarms.photo_url.split("/").pop();
            const photoBlob = bucket.file(`farm-photos/${photoName}`);
            const [photoExists] = await photoBlob.exists();
    
            if (photoExists) {
            await photoBlob.delete();
            }
        }
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
        res.status(200).json({message: "Data peternakan berhasil dihapus"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Data peternakan gagal dihapus"})
    }
};

