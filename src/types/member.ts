import { ObjectId } from "mongodb";

export interface IMember {
  userId: ObjectId;
  name: string;
  address: string;
  dob: string;
  email: string;
  avatar: string;
  phone?: number;
}