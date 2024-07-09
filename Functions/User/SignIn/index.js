import { User } from "../../../Models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { refreshTokens } from "../../../Common/tokens.js";

dotenv.config();

const generateAccessToken = (email) => {
  return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "8h",
  });
};

const generateRefreshToken = (email) => {
  return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET);
};
export async function signIn(req, res) {
  let response = {
    code: 400,
    msg: "Try again after sometimes",
  };
  const userEmail = req.body.email;
  const unHashedPassword = req.body?.password;
  await User.findOne({ email: userEmail?.toLowerCase() })
    .then(async (found) => {
      const hashedPassword = found?.password;
      const result = await bcryptjs.compare(unHashedPassword, hashedPassword);
      if (result) {
        const accessToken = generateAccessToken(userEmail);
        const refreshToken = generateRefreshToken(userEmail);
        refreshTokens.push(refreshToken);
        response = {
          code: 200,
          msg: "Success",
          data: {
            email: found?.email,
            isAdmin: found?.isAdmin,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        };
      } else {
        response = {
          code: 401,
          msg: "Invalid Credentials",
        };
      }
    })
    .catch((err) => {
      response = {
        code: 404,
        msg: "User not found",
      };
    });

  res.json(response);
}

export async function getToken(req, res) {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const userPayload = { name: user.name };
    const accessToken = generateAccessToken(userPayload);
    res.json({ accessToken });
  });
}
