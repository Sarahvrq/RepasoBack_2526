import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

import { dbName } from "../utils" //para no tener que declarar nombres over and over again

dotenv.config();

let client: MongoClient;
let dB: Db;

export const connectToMongoDB = async () => {

    try{
        const mongoUrl = process.env.MONGO_URL;
            if(!mongoUrl) throw new Error ("No has metido las url de Mongo correctamente");
            client = new MongoClient(mongoUrl!); //definimos el cliente
            await client.connect(); //conectamos al cliente (una conexion a internet que es una promesa)
            dB = client.db(dbName); 
            console.log("EXITO conectando a MongoDB");
    } catch(err){
        console.log("ERROR MongoDB: ", err)
    }
};

export const getDB = (): Db => dB;


export const closeMongoDB = async () => {
    try{
        client && await client.close();
    }catch(err){
        console.log("ERROR cerrando MongoDB: ", err)
    }
};