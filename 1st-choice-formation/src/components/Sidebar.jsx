import React, { Fragment } from 'react';
import { Link,NavLink } from 'react-router-dom';
import { SITENAME,SITENAMEALIAS } from '../utils/init';
import { storeCurrentRoute } from '../utils/library';
import { withRouter } from 'react-router-dom';


 class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

        /**** BINDING FUNCTION ****/
        this.toggleNavigationDropdown = this.toggleNavigationDropdown.bind(this);
    }


    

    /**** FUNCTION DEFINATION FOR TOGGLING DROPDOWN OF NAVIGATION ****/
    toggleNavigationDropdown = (e) => {
        let node = document.getElementById(e.target.id)
        if(node.parentElement.classList.contains('show')){
            node.parentElement.classList.remove('show')
			node.nextSibling.classList.remove('show')
        }else{
            node.parentElement.classList.add('show')
            node.nextSibling.classList.add('show')
        }
    }


    render() {
		console.log(this.props.location.pathname)
        return (
            <Fragment>
                <div className="sidebar">
            <nav className="sidebar-nav">
               <ul className="nav">
                  <li className="nav-item">
                     <NavLink className="nav-link" activeClassName="active" to="/dashboard" >
                    <i className="fas fa-home mr-2" ></i>Dashboard </NavLink>
                  </li>
                  {/* <li className="nav-item dropdown">
					<Link className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <i className="nav-icon fas fa-folder"></i>Folders
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					  <Link className="dropdown-item" href="personalfolders.html"> <i className="nav-icon fas fa-user"></i>Personal Folders</Link>
					  <Link className="dropdown-item" href="sharedfolders.html"> <i className="nav-icon fas fa-user-friends"></i>Shared Folders</Link>
					  <Link className="dropdown-item" href="favorites.html"> <i className="nav-icon fas fa-star"></i>Favorites</Link>
					   <div className="dropdown-divider"></div>
					   <Link className="dropdown-item" href="filebox.html"> <i className="nav-icon fas fa-archive"></i>File box</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-recycle"></i>Recycle Bin</Link>
					</div>
				  </li>
                  <li className="nav-item dropdown">
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
				  <li className="nav-item dropdown">
					<Link className={
						 (this.props.location.pathname == '/create-client') || (this.props.location.pathname == '/browse-clients') ||  (this.props.location.pathname == '/manage-user-home') || (this.props.location.pathname == '/create-employee') || (this.props.location.pathname == '/browse-employees') ? 'nav-link dropdown-toggle active' : 'nav-link dropdown-toggle'
						}  id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleNavigationDropdown}>
					  <i className=" fas fa-user-friends mr-1"></i>People
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					  <NavLink className="dropdown-item" to="/manage-user-home" activeClassName="active"> <i className="fas fa-users"></i>Manage Users Home</NavLink>
					  <NavLink className="dropdown-item" activeClassName="active" to="/browse-employees"> <i className="fas fa-user"></i>Browse Employees</NavLink>
					  <NavLink className="dropdown-item" to="/browse-clients" activeClassName="active"> <i className="fas fa-user"></i>Browse Clients</NavLink>
					   {/* <Link className="dropdown-item" href="filebox.html"> <i className="nav-icon fas fa-location-arrow"></i>Shared Address Book</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-location-arrow"></i>Personal Address Book</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-users"></i>Distribution Groups</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-envelope"></i>Resend Welcome Emails</Link> */}
					</div>
				  </li>
				 <li className="nav-item dropdown">
					<Link className="nav-link dropdown-toggle "  id="navbarDropdownSettings" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleNavigationDropdown}>
					  <i className="fas fa-cog mr-2"></i>Settings
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdownSettings">
					  <NavLink className="dropdown-item " to="/menu-item" activeClassName="active">Menu Item</NavLink>
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

    }
}

export default withRouter(Sidebar);