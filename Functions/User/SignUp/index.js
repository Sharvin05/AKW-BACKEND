import { User } from "../../../Models/user.js";
import bcryptjs from "bcryptjs";
export async function signUp(req, res) {
  let response = {
    msg: "Try again!",
    code: 500,
  };

  const salt = await bcryptjs.genSalt();
  const unHashedPassword = req.body?.password;
  const hashedPassword = await bcryptjs.hash(unHashedPassword, salt);
  const email = (req.body?.email).toLowerCase();
  const newUser = User({
    email: email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  await User.findOne({ email: email }).then(async (found) => {
    if (found) {
      response = {
        code: 501,
        msg: "User already exists",
      };
    } else {
      const status = await newUser.save();
      if (status) {
        response = {
          code: 200,
          msg: "Success",
        };
      }
    }
  });

  res.json(response);
}
