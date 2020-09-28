import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import BrowseClients from './pages/BrowseClients'
import CreateClient from './pages/CreateClient'
import UpdateClient from './pages/UpdateClient'
import BrowseEmployees from './pages/BrowseEmployees'
import CreateEmployee from './pages/CreateEmployee'
import UpdateEmployee from './pages/UpdateEmployee'
import ManageUserHome from './pages/ManageUserHome'
import PersonalSettings from './pages/PersonalSettings'
import PersonalFolders from './pages/PersonalFolders'
import SharedFolders from './pages/SharedFolders'
import FavoriteFolders from './pages/FavoriteFolders'
import FolderDetails from './pages/FolderDetails'
import {BrowserRouter as Router, Switch,Route,withRouter,NavLink} from 'react-router-dom';
import { SITENAMEALIAS } from './utils/init';
import ProtectedRoute from './utils/ProtectedRoute'

function App() {
  return (
    <div className="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show  pace-done">
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/" component={Login} exact/>
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/browse-clients" component={BrowseClients} />
          <ProtectedRoute path="/create-client" component={CreateClient} />
          <ProtectedRoute path="/update-client/:id" component={UpdateClient} />
          <ProtectedRoute path="/browse-employees" component={BrowseEmployees} />
          <ProtectedRoute path="/create-employee" component={CreateEmployee} />
          <ProtectedRoute path="/update-employee/:id" component={UpdateEmployee} />
          <ProtectedRoute path="/manage-user-home" component={ManageUserHome} />
          <ProtectedRoute path="/personal-settings" component={PersonalSettings} />
          <ProtectedRoute path="/personal-folders" component={PersonalFolders} />
          <ProtectedRoute path="/shared-folders" component={SharedFolders} />
          <ProtectedRoute path="/favorite-folders" component={FavoriteFolders} />
          <ProtectedRoute path="/folder-details/:param1/:param2" component={FolderDetails} />
          <ProtectedRoute path="*" component={NotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
