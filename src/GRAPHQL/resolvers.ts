import { ObjectId } from "mongodb";
import { getDB } from "../DB/mongo"
import { IResolvers } from "@graphql-tools/utils";
import { signToken } from "../auth";



export const resolvers: IResolvers = {
 
  Query: {
    me: async (_, __, {user}) => { //importante poner padre como _ e hijo como __
      if(!user) throw new Error("Login necesario");
      return{_id: user._id.toString(), ...user}
    },

    clothing: async (_, {page, size}) => {
      return await getClothing(page, size);
    },

    closet: async (_, {id}) => {
      return await getClothingPorID(id);
    }

  },

  Mutation: {
    register: async (_, {email, password}) => {
      const UserID = await createUser (email, password); //desde collections
      console.log("prueba" + UserID);
      return signToken(UserID);
    },

    login: async(_, {email, password}) => {
      const user = await validateUser(email, password); //desde collections
      if(!user) throw new Error ("Credenciales incorrectos");
      return signToken(user._id.toString()); //retornamos el token si fue exito
    },

    addClothing: async (_, {name, size, color, price}, {user}) => {
      if(!user) throw new Error ("Tienes que estar logeado para crear prendas");
      const result = await createClothing(name, size, color, price);
      return result;
    },

    buyClothing: async (_, {clothingID}, {user}) => {
      if(!user) throw new Error ("Tienes que estar logeado para comprar prendas");    
      return await buyClothing(clothingID, user.userId);  

    }

  },

  //encadenamiento de closet: [Clothing]!
  User: {
    closet: async (parent) => {
      return await getClosetFromIDs(parent.closet);
    }

  }

};