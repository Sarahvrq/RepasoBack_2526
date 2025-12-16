import { ApolloServer } from "apollo-server";
import { connectToMongoDB } from "./DB/mongo"
import { typeDefs } from "./GRAPHQL/schema";
import { resolvers } from "./GRAPHQL/resolvers";
import { getUserFromToken } from "./auth";


const start = async () => {
  await connectToMongoDB(); //conexion a mongo

  const server = new ApolloServer({ //conexion a apolloserver, comrpobando login
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || ""; //recibimos el token
      const user = token ? await getUserFromToken(token) : null;
      return { user };
    },
  });

  await server.listen({ port: 4003 }); //puerto
  console.log("GQL corriendo desde puerto 4003");
};

start().catch(err=>console.error(err)); //ejecutamos funcion start