import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { SITENAME,SITENAMEALIAS } from '../utils/init';
import { storeCurrentRoute } from '../utils/library';
import { withRouter } from 'react-router-dom';


 class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        /***  BIND FUNCTIONS ***/
        this.toggleSidebar = this.toggleSidebar.bind(this)
    }

    /*** FUNCTION DEFINATION FOR TOGGLING SIDEBAR ***/
     toggleSidebar = () =>{
       let element =  document.querySelector('.app')
       if(element.classList.contains('sidebar-lg-show')){
        element.classList.remove('sidebar-lg-show')
       }else{
        element.classList.add('sidebar-lg-show')
       }
    }


    render() {
        return (
            <Fragment>
                 <header className="app-header navbar">
                    <button className="navbar-toggler sidebar-toggler d-lg-none mr-auto" type="button" data-toggle="sidebar-show">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand" to="/dashboard">
                    <img className="navbar-brand-full img-fluid" src={require('../assets/image/logo.png')} alt="Logo"/>
                    <img className="navbar-brand-minimized" src={require('../assets/image/sm_logo.png')} alt="Logo" />
                    </Link>
                    <button className="navbar-toggler sidebar-toggler d-md-down-none" type="button" onClick={this.toggleSidebar} data-toggle="sidebar-lg-show">
                    <i className="fas fa-bars"></i>
                    </button>
                    <ul className="nav navbar-nav d-md-down-none">
                        <li className="nav-item px-3">
                        <Link className="nav-link" to="/dashboard"><i className="nav-icon fas fa-home mr-1" style={{marginTop:'2.1px'}}></i>Dashboard</Link>
                        </li>
                    </ul>
                     <ul className="nav navbar-nav ml-auto top_menu">
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><i className="nav-icon fas fa-question-circle mr-1" style={{marginTop:'2.1px'}}></i>Help</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><i className="nav-icon fas fa-rocket mr-1" style={{marginTop:'2.1px'}}></i>Apps</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/"><i className="nav-icon fas fa-sign-out-alt mr-1" style={{marginTop:'2.1px'}}></i>Logout</Link>
                        </li> 
                    </ul> 
                </header> 
            </Fragment>
        )
    }
    componentDidMount(){
        /*** calling function for storing current route ***/
        storeCurrentRoute(this.props.location.pathname)

    }
}

export default withRouter(Header);