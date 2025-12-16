import { getDB } from "../DB/mongo"
import bcrypt from "bcryptjs" //importante para encriptar (y no desenctriptar)
import { USER_COLLECTION } from "../utils";
import { getClothingPorID } from "./Clothing";
import { ObjectId } from "mongodb";

export const createUser = async (email: string, password: string) => {
    const db = getDB(); //llamamos a nuestra DB
    const passEncrypt = await bcrypt.hash(password, 10); //encriptamos
    const result = await db.collection(USER_COLLECTION).insertOne( {email, password: passEncrypt}); //añadimos user a DB

    return result.insertedId.toString();
}

export const validateUser = async(email: string, password: string) => {
    const db = getDB();

    const user = await db.collection(USER_COLLECTION).findOne({email});
    if(!user) return null;

    const passComparacion = await bcrypt.compare(password, user.password);
    if (!passComparacion) return null;

    return user;
}

export const buyClothing = async (idClothing: string, UserID: string) => {
    const db = getDB();

    const checkClothesExists = await getClothingPorID(idClothing);
    if(!checkClothesExists) return new Error("Articulo no existe");
    await db.collection(USER_COLLECTION).updateOne({_id: new ObjectId(UserID)}, {$addToSet: {closet: idClothing}});
    
    const updatedUser = await db.collection(USER_COLLECTION).findOne({_id: new ObjectId(UserID)});

    return updatedUser;
}
