import { Router } from "express";
import { ObjectId } from "mongodb";

import { collections } from "../services/database.service";
import asyncHandler from "../util/asyncHandler";
import upload from "../util/uploadHelper";

const routes = Router();
// Add member
routes.post("/add", upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Avatar not found" })
  }

  const { userId, name, address, dob, email, phone } = req.body;

  // remove the optional field
  if (!phone) {
    delete req.body.phone
  }

  // attach uploaded file to avatar
  req.body.avatar = req.file.filename;

  const result = await collections.members.insertOne(req.body);

  if (result) {
    res.json({ message: "success" });
  } else {
    res.status(400).json({ message: "Failed to add member" });
  }
})
);

// Update member avatar
routes.put("/update/avatar/:id", upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Avatar not found" })
  }

  const { id } = req.params;

  const member = await collections.members.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { avatar: req.file.filename } }
  );

  if (member && member.value) {
    res.json({ message: "success", member: member });
  } else if (!member.value) {
    res.status(400).json({ message: "Member not found" });
  } else {
    res.status(400).json({ message: "Failed to update member avatar", member });
  }
})
);
export default routes;