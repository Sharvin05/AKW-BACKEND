import {User} from "../../../Models/user.js";
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {refreshTokens} from "../../../Common/tokens.js";

dotenv.config();
export async function signIn(req,res){
    const generateAccessToken = (email) => {
        return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '8h' });
    };

    const generateRefreshToken = (email) => {
        return jwt.sign({ email:email }, process.env.REFRESH_TOKEN_SECRET);
    };
    let response={
        code:400,
        msg:'Try again after sometimes'
    };
    const userEmail= req.body.email
    const unHashedPassword = req.body?.password
    await User.findOne({email:userEmail?.toLowerCase()}).then(async(found)=>{
        const hashedPassword=found?.password
        const result = await bcryptjs.compare(unHashedPassword,hashedPassword);
        console.log("found",found)
        if(result){
            const accessToken = generateAccessToken(userEmail);
            const refreshToken = generateRefreshToken(userEmail);
            refreshTokens.push(refreshToken)
            response={
                code:200,
                msg:'Success',
                data:{
                    email:found?.email,
                    isAdmin:found?.isAdmin,
                    accessToken:accessToken,
                    refreshToken:refreshToken
                }
            }
        }else{
            response={
                code:401,
                msg:'Invalid Credentials'
            }
        }
    }).catch((err)=>{
        response={
            code:404,
            msg:'User not found'
        }
    })

    const jsonValue = JSON.stringify(response)
    res.end(jsonValue)
}