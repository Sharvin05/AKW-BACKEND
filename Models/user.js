import mongoose from "mongoose";;

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    isDeleteEnabled:{
        type: Boolean,
        default: false
    },
    isEditEnabled:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    viewAccess:{
        type: Number,
        enum: [0, 1, 2],
        default: 1
    }, //0- no access, 1-owned images, 2-all images
    createdAt:Date
});

export const User = mongoose.model("user", UserSchema);