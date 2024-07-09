import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import router from "./Functions/Asset/upload.js";

import { signUp } from "./Functions/User/SignUp/index.js";
import { getToken, signIn } from "./Functions/User/SignIn/index.js";

import { authenticateToken } from "./Plugins/auth.js";
import { getUserImages } from "./Functions/Asset/getUserImages.js";
import { getUserInfo } from "./Functions/User/getUserInfo.js";
import { editUser } from "./Functions/User/editUser.js";
import { deleteEntry } from "./Functions/Asset/handleAsset.js";

const app = express();

dotenv.config();
const corsOptions = {
  origin: [process.env.FRONTEND, "http:localhost:3000"],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

async function connect() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log("the db is connected"));
  mongoose.connection.on("error", function (error) {
    console.log("error + " + error);
  });
}
connect();

app.use("/imgUpload", router);

app.post("/signIn", function (req, res) {
  signIn(req, res);
});

app.post("/signUp", function (req, res) {
  signUp(req, res);
});

app.post("/refresh-token", function (req, res) {
  getToken(req, res);
});

app.post("/editUser", authenticateToken, function (req, res) {
  editUser(req, res);
});

app.post("/deleteEntry", authenticateToken, function (req, res) {
  deleteEntry(req, res);
});

app.get("/getUserImages", authenticateToken, function (req, res) {
  getUserImages(req, res);
});

app.get("/getUserInfo", authenticateToken, function (req, res) {
  getUserInfo(req, res);
});

app.listen(process.env.PORT || 3011, function () {
  console.log("Server is running at http://localhost:3011");
});
