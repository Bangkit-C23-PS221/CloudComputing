import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";

/*import UserAyamHub from "./models/usersModels.js";*/
/*import Farms from "./models/farmModels.js";*/
/*import Chicken from "./models/chickenModels.js";*/

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected');
    //Query for create table in database
    /*await UserAyamHub.sync();*/
    /*await Farms.sync();*/
    /*await Chicken.sync();*/
} catch (error) {
    console.error(error);
}

//middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors( {Credential: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(router);

app.listen(7000, () => console.log(' Server up & running on PORT 7000 '));
