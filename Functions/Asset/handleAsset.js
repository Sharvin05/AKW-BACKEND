import {Asset} from "../../Models/asset.js";
export async function deleteEntry(req,res){
    let response = {
        code:500,
        msg:'Please try again Later'
    }
    try {
        const deleteResponse = await Asset.findByIdAndDelete(req.body?.id);

        if (deleteResponse) {
            response = {
                code: 200,
                msg: 'Entry Deleted'
            };
        } else {
            response = {
                code: 404,
                msg: 'User Not Found'
            };
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        response = {
            code: 500,
            msg: 'Internal Server Error'
        };
    }

    res.json(response);
}
