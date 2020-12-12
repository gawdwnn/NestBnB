import merge from 'lodash.merge';
import {userResolver} from './User';
import {viewerResolvers} from './Viewer';
import {listingResolvers} from './Listing';
import {bookingResolvers} from './Booking';

export const resolvers = merge(viewerResolvers, userResolver, listingResolvers, bookingResolvers);
