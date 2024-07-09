import { User } from "../../Models/user.js";
import {Asset} from "../../Models/asset.js";

export async function getUserInfo(req, res) {
    let response = {
        code: 500,
        msg: 'Try again'
    };

    try {
        const userMail = req.headers.email;
        console.log("userMail", userMail);

        const foundUsers = await User.find({ email: userMail });
        const userinfo = foundUsers[0];

        console.log("userInfo", userinfo);
        if (!userinfo?.isAdmin) {
            response = {
                code: 400,
                msg: "Unauthorized"
            };
        } else {
            const result = await User.find({ email: { $ne: userMail } });
            response = {
                code: 200,
                msg: "Success",
                data: result
            };
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
        response = {
            code: 500,
            msg: "Internal Server Error"
        };
    }

    res.json(response);
}