import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";

/*import UserAyamHub from "./models/userModels.js";*/
/*import Farms from "./models/farmModels.js";*/
/*import Bookmarks from "./models/bookmarkModels.js";*/

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('Database Connected');
    //Query for create table in database
    /*await UserAyamHub.sync();*/
    /*await Farms.sync();*/
    /*await Bookmarks.sync();*/
} catch (error) {
    console.error(error);
}

//middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors( {Credential: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT}`)
);
