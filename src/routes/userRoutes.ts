import Ajv from "ajv";
import { Router } from "express";
import { userSchema } from "../schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { collections } from "../services/database.service";
import asyncHandler from "../util/asyncHandler";
import { IUserDB } from "../types/user";

const routes = Router();
const ajv = new Ajv({ allErrors: true });

// Login 
routes.post("/login", asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await collections.users.findOne({ username }) as IUserDB;


  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_KEY,
      {
        expiresIn: "3 days",
      }
    );

    // update token to db
    await collections.users.updateOne({ username }, { $set: { token } });

    res.json({ message: "success", token });
  } else {
    res.status(404).json({ message: "Wrong credentials" });
  }
})
);

// Signup 
routes.post("/signup", asyncHandler(async (req, res) => {
  // check pass key
  if (req.body?.key !== process.env.SIGNUP_KEY) {
    return res.status(400).json({ message: "Wrong signup key" });
  }

  delete req.body.key;

  // validation
  const validate = ajv.compile(userSchema);
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({ message: "Invalid data", error: ajv.errorsText(validate.errors) });
  }

  const { name, username, password } = req.body;

  // check if user exists
  const old_user = await collections.users.findOne({ username });

  if (old_user) {
    return res.status(409).json({ message: "User already registered, please login" });
  }

  //encrypt user password
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await collections.users.insertOne({
    name,
    username,
    password: encryptedPassword,
  });

  if (user) {
    res.json({ message: "success" });
  } else {
    res.status(500).json({ message: "Failed to signup" });
  }
})
);

export default routes;