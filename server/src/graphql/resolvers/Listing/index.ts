import {IResolvers} from 'apollo-server';
import {Listing} from '../../../lib/types';

export const listingResolvers: IResolvers = {
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
};
