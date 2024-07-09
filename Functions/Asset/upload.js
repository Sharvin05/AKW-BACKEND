import multer from "multer";
import multerS3 from "multer-s3";
import {authenticateToken} from "../../Plugins/auth.js";
import {Asset} from "../../Models/asset.js";
import dotenv from "dotenv";
import express from "express";
import S3 from "aws-sdk/clients/s3.js"
import {User} from "../../Models/user.js";

const router = express.Router();

dotenv.config()

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

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
router.post('/',authenticateToken, upload.single('image'),async  (req, res) => {
    // console.log('File incoming:', req);
    console.log('File uploaded:', req.body);

    const imageUrl = req.file.location;
    const newImage = new Asset({
        url:imageUrl,
        email:req.headers?.email,
        title:req.body?.title ? req.body?.title : '',
        createdAt:new Date()
    });
    const result = await newImage.save()
    console.log("result", result)
    let response;
    if(result){
    response={
        code:200,
        msg:'Success',
    }
    }else{
        response={
            code:500,
            msg:'Please try again Later'
        }
    }
    res.json(response)
});

router.post('/update',authenticateToken, upload.single('image'),async  (req, res) => {
    // console.log('File incoming:', req);
    console.log('File uploaded:', req.body);

    const imageUrl = req.file?.location;
    // const newImage = new Asset({
    //     url:imageUrl,
    //     email:req.headers?.email,
    //     title:req.body?.title ? req.body?.title : '',
    //     createdAt:new Date()
    // });
    const assetId = req.body?.id
    let response = {
        code: 500,
        msg: 'Try again!'
    };
    try {
        const updateResponse = await Asset.findByIdAndUpdate(
            assetId,
            {
                url:imageUrl,
                title:req.body?.title
            },
            { new: true } // This option returns the updated document
        );
        console.log("edited", updateResponse);

        response = {
            code: 200,
            msg: 'User Edited'
        };
    } catch (error) {
        console.error("Error editing user:", error);
        response = {
            code: 500,
            msg: 'Internal Server Error'
        };
    }

    res.json(response)
});

export default router