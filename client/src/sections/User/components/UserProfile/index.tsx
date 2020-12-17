import React, {Fragment} from 'react';
import {Avatar, Button, Card, Divider, Tag, Typography} from 'antd';
import {User as UserData} from '../../../../lib/graphql/queries/User/__generated__/User';
import {useMutation} from '@apollo/client';
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from '../../../../lib/utils';
import {DISCONNECT_STRIPE} from '../../../../lib/graphql/mutations';
import {DisconnectStripe as DisconnectStripeData} from '../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe';
import {Viewer} from '../../../../lib/types';

interface Props {
  user: UserData['user'];
  viewerIsUser: boolean;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => Promise<void>;
}

const {Paragraph, Text, Title} = Typography;
const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

export const UserProfile = ({user, viewerIsUser, viewer, setViewer, handleUserRefetch}: Props) => {
  const [disconnectStripe, {loading}] = useMutation<DisconnectStripeData>(DISCONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.disconnectStripe) {
        setViewer({...viewer, hasWallet: data.disconnectStripe.hasWallet});
        displaySuccessNotification(
          "You've successfully disconnected from Stripe!",
          "You'll have to reconnect with Stripe to continue to create listings.",
        );
        handleUserRefetch();
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to disconnect you from Stripe. Please try again later!",
      );
    },
  });

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <>
      <Paragraph>
        <Tag color="green">Stripe Connected</Tag>
      </Paragraph>
      <Paragraph>
        Income Earned: <Text>{user.income ? formatListingPrice(user.income) : `$0`}</Text>
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        loading={loading}
        onClick={() => disconnectStripe()}
      >
        Disconnect Stripe
      </Button>
      <Paragraph type="secondary">
        By disconnecting, you won't be able to receive <Text strong>any further payments</Text>.
        This will prevent users from booking listings that you might have already created.
      </Paragraph>
    </>
  ) : (
    <>
      <Paragraph>
        Interested in becoming a NestBnB host? Register with your Stripe account!
      </Paragraph>
      <Button type="primary" className="user-profile__details-cta" onClick={redirectToStripe}>
        Connect with Stripe
      </Button>
      <Paragraph type="secondary">
        NestBnB uses{' '}
        <a href="https://stripe.com/en-US/connect" target="_blank" rel="noopener noreferrer">
          Stripe
        </a>{' '}
        to help transfer your earnings in a secure and truster manner.
      </Paragraph>
    </>
  );

  const additionalDetailsSection = viewerIsUser ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>Additional Details</Title>
        {additionalDetails}
      </div>
    </Fragment>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
