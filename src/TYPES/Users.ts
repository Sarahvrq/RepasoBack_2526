import { ObjectId } from "mongodb"

export type Users = {

  _id: ObjectId
  username: String,
  email: String,
  password: String,
  createdAt: Date
  
};