import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import S3 from "aws-sdk/clients/s3.js"
import multerS3 from "multer-s3"
import multer from"multer"
import {Asset} from "./Models/asset.js";



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



// Configure AWS
// aws.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// });
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
console.log("env variables", [  region,
    accessKeyId,
    secretAccessKey])
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

console.log("the aws config", s3)
// Set up multer to use S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

// Endpoint to upload image
app.post('/imgUpload', upload.single('image'),async  (req, res) => {
    // console.log('File incoming:', req);
    // console.log('File uploaded:', req.file);

    const imageUrl = req.file.location;
    console.log("the image is stored in ", imageUrl)


    // const newImage = new Asset({
    //     url:imageUrl,
    //     uploadedBy:req.headers.id,
    //     assetHolder:req.headers.company,
    //     isUserAsset:req.body.isUserAsset,
    // });
    // const status = await newImage.save()
    let response;
    // if(status){
        response={
            code:200,
            msg:'Success',
            data:{
                imageUrl: imageUrl
            }
        }
    // }else{
    //     response={
    //         code:500,
    //         msg:'Please try again Later'
    //     }
    // }
    const jsonvalue = JSON.stringify(response)
    res.end(jsonvalue)
});

app.listen(process.env.PORT || 3011, function () {
    console.log("Server is running at http://localhost:3011");
});
