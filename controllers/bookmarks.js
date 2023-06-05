const Bookmarks = require("../models/bookmarkModels.js");
const Farms = require("../models/farmModels.js");
const UserAyamHub = require("../models/userModels.js");

exports.getAllBookmarks = async (req, res) => {
    const { id_user } = req.params;
    try {
        const bookmark = await Bookmarks.findAll({
            attributes: ['id_bookmark', 'id_farm', 'id_user'],
            where: { id_user: id_user },
            include: [
                {
                    model: Farms,
                    attributes: ['name_farm', 'type_chicken', 'price_chicken', 'age_chicken', 'weight_chicken', 'stock_chicken', 'desc_farm', 'address_farm', 'photo_url', 'status'],
                },
                {
                    model: UserAyamHub,
                    attributes: ['phone'],
                }
            ],
        });
        res.json(bookmark);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal mendapatkan daftar bookmark" });
    }
};

exports.addBookmarks = async (req, res) => {
    const { id_user, id_farm } = req.params;

    try {
        const existingUser = await UserAyamHub.findOne({
            where: { id_user: id_user }
        });
        if (!existingUser) {
            return res.status(400).json({ message: "Pengguna tidak ditemukan" });
        }

        const existingFarm = await Farms.findOne({
            where: { id_farm: id_farm }
        });
        if (!existingFarm) {
            return res.status(400).json({ message: "Peternakan tidak ditemukan" });
        }

        const existingBookmark = await Bookmarks.findOne({
            where: { id_user: id_user, id_farm: id_farm }
        });
        if (existingBookmark) {
            return res.status(400).json({ message: "Bookmark sudah ada" });
        }

        await Bookmarks.create({
            id_farm: id_farm,
            id_user: id_user
        });
        res.json({ message: "Bookmark berhasil ditambahkan" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Bookmark gagal ditambahkan" });
    }
};

exports.deleteBookmarks = async (req, res) => {
    const { id_user, id_farm } = req.params;

    try {
        const existingBookmark = await Bookmarks.findOne({
            where: {
                id_user: id_user,
                id_farm: id_farm
            }
        });
        if (!existingBookmark) {
            return res.status(400).json({ message: "Bookmark tidak ditemukan" });
        }

        await Bookmarks.destroy({
            where: {
                id_user: id_user,
                id_farm: id_farm
            }
        });
        res.json({ message: "Bookmark berhasil dihapus" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Bookmark gagal dihapus" });
    }
};

exports.checkBookmarkStatus = async (req, res) => {
    const { id_user, id_farm } = req.params;

    try {
        const existingUser = await UserAyamHub.findOne({
            where: { id_user: id_user }
        });
        if (!existingUser) {
            return res.status(400).json({ message: "Pengguna tidak ditemukan" });
        }

        const existingFarm = await Farms.findOne({
            where: { id_farm: id_farm }
        });
        if (!existingFarm) {
            return res.status(400).json({ message: "Peternakan tidak ditemukan" });
        }

        const bookmark = await Bookmarks.findOne({
            where: {
                id_user: id_user,
                id_farm: id_farm
            }
        });
        if (bookmark) {
            res.json({ isBookmarked: true, id_bookmark: bookmark.id_bookmark });
        } else {
            res.json({ isBookmarked: false, id_bookmark: null });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Gagal menampilkan status bookmark" });
    }
};
