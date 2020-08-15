import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import BrowseClients from './pages/BrowseClients'
import {BrowserRouter as Router, Switch,Route,withRouter,NavLink} from 'react-router-dom';
import { SITENAMEALIAS } from './utils/init';
import ProtectedRoute from './utils/ProtectedRoute'

function App() {
  return (
    <div className="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show  pace-done">
      <Router>
        <Switch>
          <Route path="/" component={Login} exact/>
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/browse-clients" component={BrowseClients} />
          <ProtectedRoute path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
