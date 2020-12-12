import {IResolvers} from 'apollo-server';
import {Booking, Database, Listing} from '../../../lib/types';

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => booking._id.toString(),
    listing: (booking: Booking, _args: {}, {db}: {db: Database}): Promise<Listing | null> => {
      return db.listings.findOne({_id: booking.listing});
    },
  },
};
