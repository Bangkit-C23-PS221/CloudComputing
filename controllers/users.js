import UserAyamHub from "../models/usersModels.js";
import bcrypt from "bcrypt";
import jsontoken from "jsonwebtoken";

export const getUsers = async(req, res) => {
    try {
        const user = await UserAyamHub.findAll({
            attributes: ['id_user', 'name', 'email', 'phone', 'userLevel' ]
        });
        res.json(user);
    } catch (error) {
        console.log(error);
    }
}

export const RegistUser = async(req, res) => {
    const{name, password, email, phone} = req.body;
    const salt =  await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
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
            isFarm: false
        });
        res.json({message: "Registrasi berhasil"});
    } catch (error) {
        console.log(error);
    }
}

export const LoginUser = async(req, res) => {
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
        const idUser = user[0].id_user;
        const name = user[0].name;
        const email = user[0].email;
        const phone = user[0].phone;
        const userLevel = user[0].userLevel;
        const accessToken = jsontoken.sign({idUser, name, email, phone, userLevel}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "60s"
        });
        const tokenRefresh = jsontoken.sign({idUser, name, email, phone, userLevel}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "12h"
        });
        //save refresh token in database
        await UserAyamHub.update({refresh_token: tokenRefresh}, {
            where:{
                id_user: idUser
            }
        });
        //sent http cookie to client
        res.cookie('tokenRefresh', tokenRefresh, {
            httpOnly: true,
            maxAge : 24 * 60 * 60 * 1000
        });
        //sent access token to client
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({message: "Email tidak ditemukan"});
    }
}

export const LogoutUser = async(req, res) => {
    const tokenRefresh = req.cookies.tokenRefresh;
    if(!tokenRefresh) return res.sendStatus(204);

    //If get the token, compare with token in the database
    const user = await UserAyamHub.findAll({
        where:{
            refresh_token: tokenRefresh
        } 
    });
    //Token invalid
    if(!user[0]) return res.sendStatus(204);
    //Get id_user from database & clear the refresh_token
    const idUser = user[0].id_user;
    await UserAyamHub.update({refresh_token: null}, {
        where: {
            id_user: idUser
        }
    });
    res.clearCookie('tokenRefresh');
    return res.sendStatus(200);
}

export const UpdateUser = async(req, res) => {
    const { id_user } = req.params;
    const{ name, password, email, phone } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    try {
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
        res.json({message: "Update berhasil"});
    } catch (error) {
        console.log(error);
    }
}



