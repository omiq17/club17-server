import { Router } from "express";
import { collections } from "../services/database.service";
import asyncHandler from "../util/asyncHandler";

const routes = Router();

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
  const { name, username, password, key } = req.body;

  if (key !== process.env.SIGNUP_KEY) {
    return res.status(400).json({ message: "Wrong signup key" });
  }

  const user = await collections.users.insertOne({ name, username, password });

  if (user) {
    res.json({ message: "success", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
})
);

export default routes;