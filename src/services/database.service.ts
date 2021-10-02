// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { IUser } from "../types/user";
import { IMember } from "../types/member";

// Global Variables
export const collections: {
  users?: mongoDB.Collection<IUser>,
  members?: mongoDB.Collection<IMember>
} = {};

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const usersCollection: mongoDB.Collection<IUser> = db.collection(process.env.USERS_COLLECTION_NAME);
  const membersCollection: mongoDB.Collection<IMember> = db.collection(process.env.MEMBERS_COLLECTION_NAME);

  collections.users = usersCollection;
  collections.members = membersCollection;

  console.log(`Successfully connected to database: ${db.databaseName}`);
}