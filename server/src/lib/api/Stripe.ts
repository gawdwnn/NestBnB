import Stripe from 'stripe';

const client = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
  typescript: true,
});

export const StripeResolver = {
  connect: async (code: string): Promise<Stripe.OAuthToken> => {
    const response = await client.oauth.token({grant_type: 'authorization_code', code});
    return response;
  },
};
