import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Home, Host, Listing, Listings, NotFound, User} from './sections';
import './styles/index.css';

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
});

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/host" component={Host} />
      <Route exact path="/listing/:id" component={Listing} />
      <Route exact path="/listings/:location?" component={Listings} />
      <Route exact path="/user/:id" component={User} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
