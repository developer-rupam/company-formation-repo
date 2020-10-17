import React, { Fragment } from 'react';
import { Link,NavLink } from 'react-router-dom';
import { SITENAME,SITENAMEALIAS } from '../utils/init';
import { storeCurrentRoute } from '../utils/library';
import { withRouter } from 'react-router-dom';


 class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			hasAccessToManageEmployees : false,
			hasAccessToManageClients : false,
			hasPermissionToAccessPersonalSettings : false
		}

        /**** BINDING FUNCTION ****/
        this.toggleNavigationDropdown = this.toggleNavigationDropdown.bind(this);
        this.getLoggedInUserDetailsForPermission = this.getLoggedInUserDetailsForPermission.bind(this);
    }


    

    /**** FUNCTION DEFINATION FOR TOGGLING DROPDOWN OF NAVIGATION ****/
    toggleNavigationDropdown = (e) => {
		let node = document.getElementById(e.target.id)
        if(node.parentElement.classList.contains('show')){
			alert('if')
            node.parentElement.classList.remove('show')
			node.nextSibling.classList.remove('show')
			node.nextSibling.removeAttribute("style")
        }else{
			alert('else')
            node.parentElement.classList.add('show')
            node.nextSibling.classList.add('show')
            node.nextSibling.setAttribute("style", "top: 0px;left: 0px;")
        }
	}
	
	/*** FUNCTION DEFINATION TO GET LOGGED IN USER DETAILS FOR PERMISSION ***/
	getLoggedInUserDetailsForPermission = () => {
		let session = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session')))
		console.log(session)
		if(session.user_role == 'ADMIN'){
			var manageClients = true;
			var manageEmployees = true;
		}else if(session.user_role == 'CLIENT'){
			var manageClients = false;
			var manageEmployees = false;
		}else{
			var manageClients = session.manage_client;
			var manageEmployees = session.manage_employee;
		}
		this.setState({
			hasAccessToManageClients : manageClients,
			hasAccessToManageEmployees : manageEmployees,
			hasPermissionToAccessPersonalSettings:session.access_user_settings,
		})
	}


    render() {
		
        return (
            <Fragment>
                <div className="sidebar">
            <nav className="sidebar-nav">
               <ul className="nav">
                  <li className="nav-item">
                     <NavLink className="nav-link" activeClassName="active" to="/dashboard" >
                    <i className="fas fa-home mr-2" ></i>Dashboard </NavLink>
                  </li>
                   <li className="nav-item dropdown">
					<Link className={
						 (this.props.location.pathname == '/personal-folders') || (this.props.location.pathname == '/shared-folders') ||  (this.props.location.pathname == '/favorite-folders') ? 'nav-link dropdown-toggle active' : 'nav-link dropdown-toggle'
						}  id="navbarDropdownFolder" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleNavigationDropdown}>
					  <i className="fas fa-folder"></i> Folders
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					  <NavLink className="dropdown-item" to="/personal-folders"> <i className=" fas fa-user"></i> Personal Folders</NavLink>
					  <NavLink className="dropdown-item" to="/shared-folders"> <i className=" fas fa-user-friends"></i> Shared Folders</NavLink>
					  <NavLink className="dropdown-item" to="/favorite-folders"> <i className=" fas fa-star"></i> Favorites</NavLink>
					   {/*<div className="dropdown-divider"></div>
					    <NavLink className="dropdown-item" href="filebox.html"> <i className="nav-icon fas fa-archive"></i>File box</NavLink>
					   <NavLink className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-recycle"></i>Recycle Bin</NavLink> */}
					</div>
				  </li>
                  {/*<li className="nav-item dropdown">
					<Link className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <i className="nav-icon fas fa-project-diagram"></i>Workflows
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					  <Link className="dropdown-item" href="#">Menu Item</Link>
					</div>
				  </li>
				  <li className="nav-item dropdown">
					<Link className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <i className="nav-icon fas fa-envelope"></i>Inbox
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					  <Link className="dropdown-item" href="#">Menu Item</Link>
					</div>
				  </li> */}
				  {(this.state.hasAccessToManageClients || this.state.hasAccessToManageEmployees) ? <li className="nav-item dropdown">
					 <Link className={
						 (this.props.location.pathname == '/create-client') || (this.props.location.pathname == '/browse-clients') ||  (this.props.location.pathname == '/manage-user-home') || (this.props.location.pathname == '/create-employee') || (this.props.location.pathname == '/browse-employees') ||  (this.props.location.pathname == '/update-client') || (this.props.location.pathname == '/update-employee') ? 'nav-link dropdown-toggle active' : 'nav-link dropdown-toggle'
						}  id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleNavigationDropdown}>
					  <i className=" fas fa-user-friends mr-1"></i>People
					</Link> 
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					 <NavLink className="dropdown-item" to="/manage-user-home" activeClassName="active"> <i className="fas fa-users"></i>Manage Users Home</NavLink>
					  {this.state.hasAccessToManageEmployees ? <NavLink className="dropdown-item" activeClassName="active" to="/browse-employees"> <i className="fas fa-user"></i>Browse Employees</NavLink> : ''}
					  {this.state.hasAccessToManageClients ?<NavLink className="dropdown-item" to="/browse-clients" activeClassName="active"> <i className="fas fa-user"></i>Browse Clients</NavLink> : ''}
					   {/* <Link className="dropdown-item" href="filebox.html"> <i className="nav-icon fas fa-location-arrow"></i>Shared Address Book</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-location-arrow"></i>Personal Address Book</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-users"></i>Distribution Groups</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-envelope"></i>Resend Welcome Emails</Link> */}
					</div>
				  </li> : ''}
				 <li className="nav-item dropdown">
					<Link className={
						 (this.props.location.pathname == '/personal-settings')  ? 'nav-link dropdown-toggle active' : 'nav-link dropdown-toggle'
						}   id="navbarDropdownSettings" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleNavigationDropdown}>
					  <i className="fas fa-cog mr-2"></i>Settings
					</Link>
					 <div className="dropdown-menu" aria-labelledby="navbarDropdownSettings">
					 {this.state.hasPermissionToAccessPersonalSettings ? <NavLink className="dropdown-item " to="/personal-settings" activeClassName="active">Personal Settings</NavLink>: ''}
					</div>
				  </li> 
               </ul>
            </nav>
         </div> 
            </Fragment>
        )
    }
    componentDidMount(){
        /*** calling function for storing current route ***/
		storeCurrentRoute(this.props.location.pathname)
		
		/** Calling FUNCTION TO GET LOGGED IN USER DETAILS ***/
		this.getLoggedInUserDetailsForPermission();

    }
}

export default withRouter(Sidebar);