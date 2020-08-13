import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard'
import {BrowserRouter as Router, Switch,Route,withRouter} from 'react-router-dom';
import { SITENAMEALIAS } from './utils/init';

function App() {
  return (
    <div className="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show  pace-done">
      <Router>
         {/*  <Route path="/" component={Login} exact/>
          <Route path="/signup" component={Signup} /> */}
          <Route path="/" component={Dashboard} exact/>
          <Route path="/dashboard" component={Dashboard} />
         {/*  <Route path="/settings" component={Settings} /> */}
                           
        </Router>
    </div>
  );
}

export default App;
