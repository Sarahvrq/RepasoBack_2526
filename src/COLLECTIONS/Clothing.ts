import { ObjectId } from "mongodb";
import { getDB } from "../DB/mongo"
import { CLOTHING_COLLECTION } from "../utils";


export const getClothing = async (page?: number, size?: number) => {
    const db = getDB();
    page = page || 1; //es lo mismo que decir const new page = page || 1, pero evitamos declarar nuevas variables
    size = size || 10; 

    return await db.collection(CLOTHING_COLLECTION).find().skip((page -1)*size).limit(size).toArray();

}

export const getClothingPorID = async (id: string) => {
    const db = getDB();
    return await db.collection(CLOTHING_COLLECTION).findOne({_id: new ObjectId(id)});
}

export const createClothing = async (name: string, size: string, color: string, price: number) => {
    const db = getDB();
    const result = await db.collection(CLOTHING_COLLECTION).insertOne({name, size, color, price}); //creamos piece of clothing nuevo

    const newClothing = await getClothingPorID(result.insertedId.toString()); //confirmamos
    return newClothing;
}

//en la coleccion de closet, get ids of clothing
export const getClosetFromIDs = async (ids: Array<string>) => {
    const db = getDB();
    const idsParaMongo = ids.map(x=> new ObjectId(x));
    return db.collection(CLOTHING_COLLECTION).find({_id: {$in: idsParaMongo}}).toArray();

}
