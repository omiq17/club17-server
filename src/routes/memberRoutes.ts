import { Router } from "express";
import { collections } from "../services/database.service";
import asyncHandler from "../util/asyncHandler";
import multer from "multer";

const routes = Router();

const upload = multer({ dest: process.env.UPLOAD_DIR })

// Add member
routes.post("/add", upload.single('avatar'), asyncHandler(async (req, res) => {
  const { userId, name, address, dob, email, phone, avatar } = req.body;

  console.log(req.file, "here")
  if (!req.file) {
    return res.status(400).json({ message: "Avatar file not found" })
  }

  // remove the optional field
  if (!phone) {
    delete req.body.phone
  }

  res.json(req.body);

  // const result = await collections.members.insertOne(req.body);

  // if (result) {
  //   res.json({ message: "success" });
  // } else {
  //   res.status(400).json({ message: "Failed to add member" });
  // }
})
);

// Update member
// routes.post("/update", asyncHandler(async (req, res) => {
//   const { userId, name, address, dob, email } = req.body;

//   const member = await collections.members.insertOne({ userId, name, address, dob, email });

//   if (member) {
//     res.json({ message: "success", member });
//   } else {
//     res.status(400).json({ message: "Failed to add member" });
//   }
// })
// );
export default routes;