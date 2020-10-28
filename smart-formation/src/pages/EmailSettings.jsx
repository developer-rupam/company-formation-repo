import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import { Link,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SITENAMEALIAS } from '../utils/init';
import {UpdateUser,UpdateEmployeeService,GetUserDetails,GetEmployeeDetails} from '../utils/service'


 class EmailSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            sessionObj:{},
            textareaWidth : 1000,
            textareaHeight : 10
        };
         /***  BINDING FUNCTIONS  ***/
         this.getLoggedInUserDetailsForPermission = this.getLoggedInUserDetailsForPermission.bind(this);
       
    }

    /*** FUNCTION DEFINATION TO GET LOGGED IN USER DETAILS FOR PERMISSION ***/
	getLoggedInUserDetailsForPermission = () => {
        let session = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session')))
        if(session.user_type == 'ADMIN'){

        }else{

        }
		
		
		
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
                                            <div className="lft-hdr">
                                                <span><i className="fas fa-user-plus"></i></span>Email Settings
                                            </div>
                                            <div className="rght-hdr ">
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_addclientmain">

                                        <div className="card card_cstm same_dv_table cust_back_card">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                <div className="lft-hdr"><span>1</span>Create Client Email Template</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-12">
                                                                        <label>Message Body</label>
                                                                        
                                                                        <textarea className="form-control" placeholder="Create client message body" cols={this.state.textareaWidth} rows={this.state.textareaHeight}
                                                                       ></textarea>
                                                                    </div>
                                                                    
                                                                </div>
                                                            
                                                            </div>
                                                        </form>
                                                      
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                       
                                       <div className="card card_cstm same_dv_table cust_back_card">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                <div className="lft-hdr"><span>2</span>Create Folder/File Email Template</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-12">
                                                                        <label>Message Body</label>
                                                                        
                                                                        <textarea className="form-control" placeholder="Create folder/file message body" cols={this.state.textareaWidth} rows={this.state.textareaHeight}
                                                                       ></textarea>
                                                                    </div>
                                                                    
                                                                </div>
                                                            
                                                            </div>
                                                        </form>
                                                      
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card card_cstm same_dv_table cust_back_card">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                <div className="lft-hdr"><span>3</span>Send login credentials to client template</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-12">
                                                                        <label>Message Body</label>
                                                                        
                                                                        <textarea className="form-control" placeholder="Send login credentials to client message body" cols={this.state.textareaWidth} rows={this.state.textareaHeight}
                                                                       ></textarea>
                                                                    </div>
                                                                    
                                                                </div>
                                                            
                                                            </div>
                                                        </form>
                                                      
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="modal_button_area">
                                             <button type="button" className="submit">Save</button>
                                           
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

   
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

export default connect(mapStateToProps,null)(withRouter(EmailSettings))

