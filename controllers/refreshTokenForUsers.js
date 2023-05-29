import UserAyamHub from "../models/usersModels.js";
import jsontoken from "jsonwebtoken";

//Create a refresh token function
export const tokenRefresh = async(req, res) => {
    try {
        const tokenRefresh = req.cookies.tokenRefresh;
        if(!tokenRefresh) return res.sendStatus(401);

        //If get the token, compare with token in the database
        const user = await UserAyamHub.findAll({
            where:{
                refresh_token: tokenRefresh
            } 
        });
        //Token invalid
        if(!user[0]) return res.sendStatus(403);
        //Token valid
        jsontoken.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const idUser = user[0].id_user;
            const name = user[0].name;
            const email = user[0].email;
            const phone = user[0].phone;
            const userLevel = user[0].userLevel;
            const accessToken = jsontoken.sign({idUser, name, email, phone, userLevel}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "30s"
            });
            res.json({ accessToken });
        });

    } catch (error) {
        concole.log(error);
    }
}

