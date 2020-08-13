import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { SITENAME,SITENAMEALIAS } from '../utils/init';
import { storeCurrentRoute } from '../utils/library';
import { withRouter } from 'react-router-dom';


 class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

        /**** BINDING FUNCTION ****/
        this.isActivePage = this.isActivePage.bind(this);
        this.toggleNavigationDropdown = this.toggleNavigationDropdown.bind(this);
    }


    /**** FUNCTION DEFINATION TO CHECK ACTIVE CLASS ****/
    isActivePage = () => {
        let pageName = (localStorage.getItem(SITENAMEALIAS + '_current_page'));

        return pageName

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
        return (
            <Fragment>
                <div className="sidebar">
            <nav className="sidebar-nav">
               <ul className="nav">
                  <li className="nav-item">
                     <Link className={"nav-link "+ (this.isActivePage() == '/dashboard' ? "active" : "")} to="/dashboard" >
        <i className="nav-icon fas fa-home" style={this.isActivePage() == '/dashboard' ? {color:'#3a6a91'} : {color:'#cccccc'}}></i>Dashboard </Link>
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
				  {/* <li className="nav-item dropdown">
					<Link className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					  <i className="nav-icon fas fa-user-friends"></i>People
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					  <Link className="dropdown-item" href="personalfolders.html"> <i className="nav-icon fas fa-users"></i>Manage Users Home</Link>
					  <Link className="dropdown-item" href="sharedfolders.html"> <i className="nav-icon fas fa-user"></i>Browse Employes</Link>
					  <Link className="dropdown-item" href="favorites.html"> <i className="nav-icon fas fa-user"></i>Browse Clients</Link>
					   <Link className="dropdown-item" href="filebox.html"> <i className="nav-icon fas fa-location-arrow"></i>Shared Address Book</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-location-arrow"></i>Personal Address Book</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-users"></i>Distribution Groups</Link>
					   <Link className="dropdown-item" href="recyclebin.html"> <i className="nav-icon fas fa-envelope"></i>Resend Welcome Emails</Link>
					</div>
				  </li> */}
				 <li className="nav-item dropdown">
					<Link className="nav-link dropdown-toggle"  id="navbarDropdownSettings" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={this.toggleNavigationDropdown}>
					  <i className="nav-icon fas fa-cog"></i>Settings
					</Link>
					<div className="dropdown-menu" aria-labelledby="navbarDropdownSettings">
					  <Link className={"dropdown-item "+ (this.isActivePage() == '/' ? "active" : "")} to="/">Menu Item</Link>
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