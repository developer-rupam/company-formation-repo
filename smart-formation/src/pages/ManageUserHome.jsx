import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Link } from 'react-router-dom';
import {setEmployeeList,setClientList } from "../utils/redux/action"
import { connect } from 'react-redux';


 class ManageUseHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            hasAccessToManageEmployees : false,
			hasAccessToManageClients : false
        };
         /***  BINDING FUNCTIONS  ***/
         this.getLoggedInUserDetailsForPermission = this.getLoggedInUserDetailsForPermission.bind(this);
         
        
      
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
        })
    }

  
    render() { 
        return (
               <Fragment>
                <Header/>
                <div className="app-body">
                    <Sidebar/>
                    <main className="main">
                        <div className="container-fluid">
                        <div id="ui-view">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card card_cstm same_dv_table">
                                    <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="lft-hdr"><span><i className="fa fa-bell" aria-hidden="true"></i></span>Manage User</div> 
                                        </div>
                                    </div>
                                    
                                    
                                        <div className="emil">
                                        <p>Search User</p>
                                        </div>
            

                                    <div className="searchinput">
                                            <div className="dropdown">
                <div className="caption">All Address Books <i className="fa fa-chevron-circle-down" aria-hidden="true"></i></div>
                <div className="list">
                <div className="item">Option 1</div>
                <div className="item">Option 2</div>
                <div className="item">Option 3</div>
                <div className="item">Option 4</div>
                <div className="item">Option 5</div>
                </div>
            </div>
            <form method="get" action="#">
                <input type="text" name="q" placeholder=" search user" className="text2" />
                <button type="submit" className="submit"><i className="fas fa-search"></i></button>
                                        </form>
            </div>
                                    
                                        <div className="opo">
                                            <div className="emil">
                                        <p>Create User</p>
                                        </div>
                                        <div className="row">
                                            
                                            
                                            {this.state.hasAccessToManageClients ? <div className="col-md-4">
                                                            <div className="createclient_main_body_item">
                                                                <Link to="/create-employee">
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-user-plus"></i>{/*  <i className="fas fa-user-plus"></i>  */}</span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Create Employee</span>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            </div> : ''}
                                            {this.state.hasAccessToManageEmployees ? <div className="col-md-4">
                                                            <div className="createclient_main_body_item">
                                                                <Link to="/create-client">
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-user-plus"></i>{/* <i className="fas fa-user-plus"></i> */}</span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Create Client</span>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            </div> : ''}
                                            
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </main>
                  </div>
                <Footer/>
                <Loader show={this.state.showLoader}/>
               </Fragment>
               
        )
    }

    componentDidMount(){
        /** Calling FUNCTION TO GET LOGGED IN USER DETAILS ***/
		this.getLoggedInUserDetailsForPermission();
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            
            console.log(this.props)
        }, 1000);
    }
    
}

const mapDispatchToProps = dispatch => {
    return {
        setEmployeeList : (array) => dispatch(setEmployeeList(array)),
        setClientList : (array) => dispatch(setClientList(array)),
    }
}

export default connect(null,mapDispatchToProps)(ManageUseHome)
