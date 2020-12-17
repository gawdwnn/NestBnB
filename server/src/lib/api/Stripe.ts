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
  charge: async (amount: number, source: string, stripeAccount: string): Promise<void> => {
    const res = await client.charges.create(
      {
        amount,
        currency: 'usd',
        source,
        application_fee_amount: Math.round(amount * 0.05),
      },
      {
        stripeAccount: stripeAccount,
      },
    );
    if (res.status !== 'succeeded') {
      throw new Error('Failed to create charge with stripe');
    }
  },
};
