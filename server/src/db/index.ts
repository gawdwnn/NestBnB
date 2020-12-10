import {MongoClient} from 'mongodb';
import {Booking, Database, Listing, User} from '../lib/types';

// const dbURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/<dbname>?retryWrites=true&w=majority`;

const dbURL = 'mongodb://localhost:27017/nestBnB';

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db('nestBnB');

  return {
    listings: db.collection<Listing>('lisitngs'),
    users: db.collection<User>('users'),
    bookings: db.collection<Booking>('bookings'),
  };
};
