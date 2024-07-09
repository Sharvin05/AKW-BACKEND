import { User } from "../../Models/user.js";

export async function editUser(req, res) {
  let response = {
    code: 500,
    msg: "Please try again later",
  };

  try {
    const updateResponse = await User.updateMany(
      { email: req.body.email },
      req.body.edited
    );

    response = {
      code: 200,
      msg: "User Edited",
    };
  } catch (error) {
    console.error("Error editing user:", error);
    response = {
      code: 500,
      msg: "Internal Server Error",
    };
  }

  res.json(response);
}
