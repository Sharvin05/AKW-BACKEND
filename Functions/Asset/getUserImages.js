import { User } from "../../Models/user.js";
import { Asset } from "../../Models/asset.js";

export async function getUserImages(req, res) {
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

        if (!userinfo) {
            response = {
                code: 404,
                msg: "User not found"
            };
        } else if (userinfo.isAdmin) {
            response = {
                code: 400,
                msg: "Unauthorized"
            };
        } else if (userinfo.viewAccess === 0) {
            response = {
                code: 200,
                msg: "No Entries to show",
                data:[]
            };
        } else if (userinfo.viewAccess === 1) {
            const result = await Asset.find({ email: userMail });
            response = {
                code: 200,
                msg: "Success",
                data: getDataFormatted(userinfo, result)
            };
        } else if (userinfo.viewAccess === 2) {
            const result = await Asset.find();
            response = {
                code: 200,
                msg: "Success",
                data: getDataFormatted(userinfo, result)
            };
        }
    } catch (error) {
        console.error("Error fetching user images:", error);
        response = {
            code: 500,
            msg: "Internal Server Error"
        };
    }

    res.json(response);
}

function getDataFormatted(user, data) {
    let result=[]
    if(data?.length >=1){
        data.map((arr)=>{
            result.push({
                id:arr?._id,
                title:arr.title,
                createdAt:arr.createdAt,
                image:arr.url,
                isEditEnabled:user?.email === arr?.email ? user?.isEditEnabled : false,
                isDeleteEnabled:user?.email === arr?.email ? user?.isDeleteEnabled : false,
            })
        })
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }else{
        return result
    }
    return result;
}
