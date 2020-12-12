import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {RouteComponentProps} from 'react-router-dom';
import {Col, Layout, Row} from 'antd';
import {USER} from '../../lib/graphql/queries';
import {User as UserData, UserVariables} from '../../lib/graphql/queries/User/__generated__/User';
import {UserBookings, UserListings, UserProfile} from './components';
import {Viewer} from '../../lib/types';
import {ErrorBanner, PageSkeleton} from '../../lib/components';

const {Content} = Layout;
const PAGE_LIMIT = 4; //3

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

export const User = ({match, viewer}: Props & RouteComponentProps<MatchParams>) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const {data, loading, error} = useQuery<UserData, UserVariables>(USER, {
    variables: {id: match.params.id, listingsPage, bookingsPage, limit: PAGE_LIMIT},
  });

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === match.params.id;

  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      setListingsPage={setListingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
      limit={PAGE_LIMIT}
    />
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="User may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  return (
    <Content className="user">
      <Row gutter={12}  justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {userListingsElement}
          {userBookingsElement}
        </Col>
      </Row>
    </Content>
  );
};
