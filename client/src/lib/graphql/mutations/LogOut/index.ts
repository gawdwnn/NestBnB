import {gql} from '@apollo/client';

export const LOG_Out = gql`
  mutation LogOut {
    logOut {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
