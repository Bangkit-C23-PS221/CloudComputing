const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/database.js");
const router = require("./routes/index.js");

/*const UserAyamHub = require("./models/userModels.js");*/
/*const Farms = require("./models/farmModels.js");*/
/*const Bookmarks = require("./models/bookmarkModels.js");*/
/*const Coba = require("./models/cobaModels.js");*/

dotenv.config();
const app = express();

db.authenticate()
  .then(() => {
    console.log("Database Connected");
    //Query for create table in database
    /*UserAyamHub.sync();*/
    /*Farms.sync();*/
    /*Bookmarks.sync();*/
    /*Coba.sync();*/
  })
  .catch((error) => {
    console.error(error);
  });

//middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors( {Credential: true, origin:'http://localhost:8081'}));
app.use(express.json());
app.use(express.static("public"));
app.use(router);

let corsOptions = {
  origin: "http://localhost:8081",
};
app.use(cors(corsOptions));

app.listen(7000, () => console.log("Server up & running on PORT 7000"));
