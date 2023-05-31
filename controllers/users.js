import UserAyamHub from "../models/userModels.js";
import bcrypt from "bcrypt";
import jsontoken from "jsonwebtoken";
import { Op } from "sequelize";

export const RegistUsers = async(req, res) => {
    const{name, password, email, phone} = req.body;
    const salt =  await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const umkm = "umkm";
    try {
        // Check if email already exists
        const existingEmailUser = await UserAyamHub.findOne({ 
            where: { email: email } 
        });
        if (existingEmailUser) {
        return res.status(400).json({ message: "Email telah terdaftar" });
        }

        // If email doesn't exist, create a new entry
        await UserAyamHub.create({
            name: name,
            password: hashedPass,
            email: email,
            phone: phone,
            userLevel: umkm
        });
        res.json({message: "Registrasi berhasil"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registrasi gagal" });
    }
}

export const LoginUsers = async(req, res) => {
    try {
        const user = await UserAyamHub.findAll({
            where:{
                email: req.body.email
            }
        });
        //Check if email exists
        if (!user) {
            return res.status(404).json({ message: "Email tidak ditemukan" });
        }
        //Check if password is correct
        const TruePassword = await bcrypt.compare(req.body.password, user[0].password);
        if(!TruePassword) return res.status(400).json({
            message: "Password tidak valid"
        });
        const id_user = user[0].id_user;
        const name = user[0].name;
        const email = user[0].email;
        const phone = user[0].phone;
        const userLevel = user[0].userLevel;
        const accessToken = jsontoken.sign({id_user, name, email, phone, userLevel}, process.env.ACCESS_TOKEN_SECRET);
        //sent response to client
        res.json({ id_user, name, email, phone, userLevel, accessToken });
    } catch (error) {
        res.status(404).json({message: "Login gagal"});
    }
}


export const UpdateUsers = async(req, res) => {
    const { id_user } = req.params;
    const{ name, password, email, phone } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    try {
        // Check if email already exists
        const existingEmailUser = await UserAyamHub.findOne({ 
            where: {
                email: email,
                id_user: { [Op.ne]: id_user }, //Keeping the email if nothing changes so that the other fields can be updated
            }
        });
        if (existingEmailUser) {
        return res.status(400).json({ message: "Email telah terdaftar, tolong gunakan email lain" });
        }

        // Update users data
        await UserAyamHub.update({
            name: name,
            password: hashedPass,
            email: email,
            phone: phone,
        }, {
            where: {
                id_user: id_user
            }
        });
        res.json({message: "Data pengguna berhasil diperbarui"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Data pengguna gagal diperbarui" });
    }
}



