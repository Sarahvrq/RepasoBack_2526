import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getDB } from "./DB/mongo";
import { ObjectId } from "mongodb";
import { USER_COLLECTION } from "./utils";

dotenv.config();
const SUPER_SECRETO = process.env.SECRET;

export const signToken = (userId: string) => {
  try {
    if (!SUPER_SECRETO)
      throw new Error("SECRET is not defined in environment variables");
    return jwt.sign({ userId }, SUPER_SECRETO!, { expiresIn: "1h" });
  } catch (err) {
    return null;
  }
};

export const verifyToken = (token: string) => {
  try {
    if (!SUPER_SECRETO) throw new Error("No SECRET to decode token");
    return jwt.verify(token, SUPER_SECRETO!) as { userId: string };
  } catch (err) {
    return null;
  }
};

export const getUserFromToken = async (token: string) => {
  const payload = verifyToken(token); //recibimos verificacion del token
  if (!payload) return null;

  const db = getDB();
  return await db
    .collection(USER_COLLECTION)
    .findOne({ _id: new ObjectId(payload.userId.toString()) });
};
