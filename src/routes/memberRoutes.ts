import { Router } from "express";
import { ObjectId } from "mongodb";
import Ajv from "ajv";

import { collections } from "../services/database.service";
import asyncHandler from "../util/asyncHandler";
import upload from "../util/uploadHelper";
import { memberSchema } from "../schemas";

const routes = Router();
const ajv = new Ajv({ allErrors: true });

// Add member
routes.post("/add", upload.single('avatar'), asyncHandler(async (req, res) => {
  // check avatar
  if (!req.file) {
    return res.status(400).json({ message: "Avatar not found" })
  }

  // attach uploaded file to avatar
  req.body.avatar = req.file.filename;

  if (req.body.phone) {
    req.body.phone = Number(req.body.phone);
  }

  // validation
  const validate = ajv.compile(memberSchema);
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({ message: "Invalid data", error: ajv.errorsText(validate.errors) });
  }

  if (!ObjectId.isValid(req.body.userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  // check if user exist
  const user = await collections.users.findOne({ _id: new ObjectId(req.body.userId) });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

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

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid member id" });
  }


  // check member and update
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


// Update member info
routes.put("/update/info/:id", asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid member id" });
  }

  if (req.body.phone) {
    req.body.phone = Number(req.body.phone);
  }

  // validation
  const validate = ajv.compile(memberSchema);
  const valid = validate(req.body);

  if (!valid) {
    return res.status(400).json({ message: "Invalid data", error: ajv.errorsText(validate.errors) });
  }

  const member = await collections.members.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );

  // check member and update
  if (member && member.value) {
    res.json({ message: "success", member: member });
  } else if (!member.value) {
    res.status(400).json({ message: "Member not found" });
  } else {
    res.status(400).json({ message: "Failed to update member avatar", member });
  }
})
);

// Get all members list by userId
routes.get("/list/:userId", asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }


  const members = await collections.members.find({ userId }).toArray();

  if (members) {
    res.json({ message: "success", members });
  } else {
    res.status(404).json({ message: "User not found" });
  }
})
);

// Delete member
routes.delete("/delete/:memberId", asyncHandler(async (req, res) => {
  const { memberId } = req.params;

  if (!ObjectId.isValid(memberId)) {
    return res.status(400).json({ message: "Invalid member id" });
  }

  const result = await collections.members.deleteOne({ _id: new ObjectId(memberId) });

  if (result && result.deletedCount === 1) {
    res.json({ message: "success" });
  } else {
    res.status(404).json({ message: "Member not found" });
  }
})
);
export default routes;