import React, {useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  useMutation,
} from '@apollo/client';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Affix, Layout, Spin} from 'antd';
import {setContext} from '@apollo/client/link/context';
import {Home, Host, Listing, Listings, NotFound, User, Login, AppHeader, Stripe} from './sections';
import './styles/index.css';
import {Viewer} from './lib/types';
import {LOG_IN} from './lib/graphql/mutations';
import {
  LogIn as LogInData,
  LogInVariables,
} from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import {AppHeaderSkeleton, ErrorBanner} from './lib/components';

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'X-CSRF-TOKEN': token || '',
    },
  };
});

const httpLink = createHttpLink({
  uri: '/api',
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  const [logIn, {error}] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onError: (err) => console.log(err),
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        // set token in sessionStorage
        if (data.logIn.token) {
          sessionStorage.setItem('token', data.logIn.token);
        } else {
          sessionStorage.removeItem('token');
        }
      }
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching NestBnB" />
        </div>
      </Layout>
    );
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" render={(props) => <Host {...props} viewer={viewer} />} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route
            exact
            path="/stripe"
            render={(props) => <Stripe {...props} viewer={viewer} setViewer={setViewer} />}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => <User {...props} viewer={viewer} setViewer={setViewer} />}
          />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
