import './env';
import {ApolloServer} from 'apollo-server-express';
import express, {Application} from 'express';
import cookieParser from 'cookie-parser';
import {connectDatabase} from './db';
import {typeDefs, resolvers} from './graphql';

const mount = async (app: Application) => {
  const db = await connectDatabase();
  app.use(express.json({limit: "2mb"}));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  const server = new ApolloServer({typeDefs, resolvers, context: ({req, res}) => ({db, req, res})});
  server.applyMiddleware({app, path: '/api'});
  app.listen(process.env.PORT);
  console.log(`[app]: http://localhost:${process.env.PORT}/api`);
};

mount(express());
