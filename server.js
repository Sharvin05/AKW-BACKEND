import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import S3 from "aws-sdk/clients/s3.js"
import multerS3 from "multer-s3"
import multer from"multer"
import {Asset} from "./Models/asset.js";

import router from "./Functions/Asset/upload.js"


import {signUp} from "./Functions/User/SignUp/index.js";
import {getToken, signIn} from "./Functions/User/SignIn/index.js";


import {authenticateToken} from "./Plugins/auth.js";
import {getUserImages} from "./Functions/Asset/getUserImages.js";

const app = express();

dotenv.config()
// mongoose.set("strictQuery", true);
const corsOptions = {
    origin:[ process.env.FRONTEND, "http:localhost:3000"],
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

async function connect() {
    await mongoose
        .connect(process.env.MONGO_URL)
        .then(console.log("the db is connected"));
    mongoose.connection.on("error", function (error) {
        console.log("error + " + error);
    });
}
connect();


// Endpoint to upload image
app.use('/imgUpload',router);

app.post("/signIn", function (req, res) {
    signIn(req,res)
});

app.post("/signUp", function (req, res) {
    signUp(req,res)
});

app.post("/refresh-token", function (req, res) {
    getToken(req,res)
});


app.get("/getUserImages",authenticateToken, function (req,res){
 getUserImages(req,res)
})

app.listen(process.env.PORT || 3011, function () {
    console.log("Server is running at http://localhost:3011");
});


