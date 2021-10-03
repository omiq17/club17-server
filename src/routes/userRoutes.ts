import Ajv from "ajv";
import { Router } from "express";
import { userSchema } from "../schemas";

import { collections } from "../services/database.service";
import asyncHandler from "../util/asyncHandler";

const routes = Router();
const ajv = new Ajv({ allErrors: true });
// Login 
routes.post("/login", asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await collections.users.findOne({ username, password });

  if (user) {
    res.json({ message: "success", user });
  } else {
    res.status(404).json({ message: "User not found" });
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

  const user = await collections.users.insertOne(req.body);

  if (user) {
    res.json({ message: "success", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
})
);

export default routes;