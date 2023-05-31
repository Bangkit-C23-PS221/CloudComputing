import Bookmarks from "../models/bookmarkModels.js";
import Farms from "../models/farmModels.js";
import UserAyamHub from "../models/userModels.js";

export const getAllBookmarks = async(req, res) => {
    const { id_user } = req.params;
    try {
        const bookmark = await Bookmarks.findAll({
            attributes: ['id_bookmark', 'id_farm', 'id_user' ],
            where: { id_user: id_user },
            // Call response from tb_farms
            include: 
            [
                {
                model: Farms,
                attributes: ['name_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'pic_farm', 'status'],
                },
            ],
        });
        res.json(bookmark);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal mendapatkan daftar bookmark" });
    }
}

export const addBookmarks = async(req, res) => {
    const { id_user, id_farm } = req.params;

    try {
        // Check if id_user exist in tb_users
        const existingUser = await UserAyamHub.findOne({
            where: { id_user: id_user}
        });
        if(!existingUser) {
            return res.status(400).json({message: "Pengguna tidak ditemukan"});
        }
        // Check if id_farm exist in tb_farms
        const existingFarm = await Farms.findOne({
            where: { id_farm: id_farm}
        });
        if(!existingFarm) {
            return res.status(400).json({message: "Peternakan tidak ditemukan"});
        }
        // Check if bookmark already exists in tb_bookmarks
        const existingBookmark = await Bookmarks.findOne({
            where: { id_user: id_user, id_farm: id_farm}
        });
        if(existingBookmark) {
            return res.status(400).json({message: "Bookmark sudah ada"});
        }

        // Create a new bookmark
        await Bookmarks.create({
            id_farm: id_farm,
            id_user: id_user
        });
        res.json({message: "Bookmark berhasil ditambahkan"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Bookmark gagal ditambahkan" });
    }
}

export const getFarmDetails = async (req, res) => {
    const { id_farm } = req.params;
    try {
        const bookmark = await Farms.findOne({
            where: { 
                id_farm: id_farm
            }
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
}

export const deleteBookmarks = async(req, res) => {
    const { id_bookmark } = req.params;

    try {
        // Check if bookmark exist
        const existingBookmark = await Bookmarks.findOne({
            where: {
                id_bookmark: id_bookmark
            }
        });
        if(!existingBookmark){
            return res.status(400).json({message: "Bookmark tidak ditemukan"});
        }
        // Delete farms
        await Bookmarks.destroy({
            where:{
                id_bookmark: id_bookmark
            }
        });
        res.json({message: "Bookmark berhasil dihapus"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Bookmark gagal dihapus"})
    }
}
