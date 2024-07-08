import mongoose from "mongoose";;

const AssetSchema = new mongoose.Schema({
    user: String,
    url:String,
    createdAt:Date
});

export const Asset = mongoose.model("asset", AssetSchema);