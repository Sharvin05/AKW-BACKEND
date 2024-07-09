import mongoose from "mongoose";;

const AssetSchema = new mongoose.Schema({
    email: String,
    title:String,
    url:String,
    createdAt:Date
});

export const Asset = mongoose.model("asset", AssetSchema);