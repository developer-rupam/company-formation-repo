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


 class PersonalSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            sessionObj:{}
        };
         /***  BINDING FUNCTIONS  ***/
         this.getLoggedInUserDetailsForPermission = this.getLoggedInUserDetailsForPermission.bind(this);
       
    }

    /*** FUNCTION DEFINATION TO GET LOGGED IN USER DETAILS FOR PERMISSION ***/
	getLoggedInUserDetailsForPermission = () => {
        let session = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session')))
        if(session.user_type == 'ADMIN' || session.user_type == 'CLIENT'){
            let payload = {
                user_id : atob(session.user_id)
            }
            this.setState({showLoader : true})
            GetUserDetails(payload).then(function(res){
                var response = res.data;
                this.setState({showLoader : false})
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    this.setState({
                        sessionName : response.response.user_name,
                        sessionEmail : atob(response.response.user_email),
                        sessionPassword : response.response.user_password,
                        sessionCompany : response.response.user_company,
                        sessionObj : response.response,
                        showLoader : false
                    })
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                  showHttpError(err,this.props)
            }.bind(this))
        }else{
            let payload = {
                user_id : atob(session.user_id)
            }
            this.setState({showLoader : true})
            GetEmployeeDetails(payload).then(function(res){
                var response = res.data;
                this.setState({showLoader : false})
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    this.setState({
                        sessionName : response.response.employee_name,
                        sessionEmail : atob(response.response.employee_email),
                        sessionPassword : response.response.employee_password,
                        sessionCompany : response.response.employee_company,
                        sessionObj : response.response,
                        showLoader : false
                    })
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                  showHttpError(err,this.props)
            }.bind(this))
        }
		
		
		
    }
    

    /*** FUNCTION DEFINATION FOR HANDLING SUBMIT FOR PERSONAL DATA ***/
    handleUpdatePersonalData = () => {
        if(this.state.sessionObj.user_role == 'ADMIN' || this.state.sessionObj.user_role == 'CLIENT'){
            var payload  = {
                "user_id": atob(this.state.sessionObj.user_id),
                "user_name": this.state.sessionObj.user_name,
                "user_email": this.state.sessionEmail,
                "user_password": this.state.sessionPassword,
                "user_company":this.state.sessionObj.user_company,
                "user_type": this.state.sessionObj.user_type,
                "user_role":this.state.sessionObj.user_role,
                "created_by":this.state.sessionObj.created_by,
                "user_status": 2,
                "access_user_settings":this.state.sessionObj.access_user_settings,
                "change_password":this.state.sessionObj.change_password
            }
            this.setState({showLoader : true})
            UpdateUser(payload).then(function(res){
                var response = res.data;
                if(response.errorResponse.errorStatusCode != 1000){
                    this.setState({showLoader : false})
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    showToast('success','Personal details updated,Please login to continue');
                    localStorage.removeItem(SITENAMEALIAS + '_session')
                    this.props.history.push('/login')
                }
             }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                  showHttpError(err,this.props)
            }.bind(this))
        }else{
            let payload = {
                "employee_id" : this.state.sessionId,
                "employee_name": this.state.sessionObj.user_name,
                "employee_email": this.state.sessionEmail,
                "employee_password":this.state.sessionPassword,
                "employee_company": this.state.sessionObj.user_company,
                "user_type": this.state.sessionObj.user_type,
                "user_role":this.state.sessionObj.user_role,
                "created_by":this.state.sessionObj.created_by,
                "access_employee_settings": this.state.sessionObj.access_employee_settings,
                "change_password": this.state.sessionObj.change_password,
                "access_company_account_setting": this.state.sessionObj.access_company_account_setting,
                "create_root_level_folder": this.state.sessionObj.access_company_account_setting,
                "use_personal_file_box": this.state.sessionObj.use_personal_file_box,
                "access_others_file_box": this.state.sessionObj.access_others_file_box,
                "manage_client": this.state.sessionObj.manage_client,
                "manage_employee": this.state.sessionObj.manage_employee,
                "access_company_account": this.state.sessionObj.access_company_account,
                "edit_shared_address_book": this.state.sessionObj.edit_shared_address_book,
                "share_distribution_groups": this.state.sessionObj.share_distribution_groups,
                "edit_other_distribution_groups": this.state.sessionObj.edit_other_distribution_groups,
                "manage_super_user_group": this.state.sessionObj.manage_super_user_group,
                "edit_account_preference": this.state.sessionObj.edit_account_preference,
                "access_reporting": this.state.sessionObj.access_reporting,
                "view_notification_history": this.state.sessionObj.view_notification_history,
                "configure_single_sign_on": this.state.sessionObj.configure_single_sign_on,
                "view_edit_billing_information": this.state.sessionObj.view_edit_billing_information,
                "request_plan_changes": this.state.sessionObj.request_plan_changes,
                "view_receipt_billing_notification": this.state.sessionObj.view_receipt_billing_notification,
                "create_manage_connectors": this.state.sessionObj.create_manage_connectors,
                "create_sharepoint_connectors": this.state.sessionObj.create_sharepoint_connectors,
                "create_network_share_connectors": this.state.sessionObj.create_network_share_connectors,
                "manage_folder_template": this.state.sessionObj.manage_folder_template,
                "manage_remote_upload_form": this.state.sessionObj.manage_remote_upload_form,
                "manage_file_drop": this.state.sessionObj.manage_file_drop,
               
            }
            this.setState({showLoader : true})
            UpdateEmployeeService(payload).then(function(res){
                var response = res.data;
                if(response.errorResponse.errorStatusCode != 1000){
                    this.setState({showLoader : false})
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    showToast('success','Personal details updated,Please login to continue');
                    localStorage.removeItem(SITENAMEALIAS + '_session')
                    this.props.history.push('/login')
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                  showHttpError(err,this.props)
            }.bind(this))
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
                                                <span><i className="fas fa-user-plus"></i></span>Personal Settings
                                            </div>
                                            <div className="rght-hdr ">
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_addclientmain">
                                        <div className="card card_cstm same_dv_table cust_back_card">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                <div className="lft-hdr"><span>1</span>Basic Info</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-4">
                                                                        <label>Name</label>
                                                                        <input type="text" className="form-control" placeholder="Name"
                                                                        defaultValue={this.state.sessionName} onBlur={(event) => {this.setState({sessionName : event.target.value})}} readOnly={!this.state.sessionObj.access_user_settings}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Email</label>
                                                                        <input type="text" className="form-control" placeholder="Email" 
                                                                        defaultValue={this.state.sessionEmail} onBlur={(event) => {this.setState({sessionEmail : event.target.value})}} readOnly={!this.state.sessionObj.access_user_settings}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Company</label>
                                                                        <input type="text" className="form-control" placeholder="Company"
                                                                       defaultValue={this.state.sessionCompany} onBlur={(event) => {this.setState({sessionCompany : event.target.value})}} readOnly={!this.state.sessionObj.access_user_settings}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Password</label>
                                                                        <input type="text" className="form-control" placeholder="Password" 
                                                                        defaultValue={this.state.sessionPassword} onBlur={(event) => {this.setState({sessionPassword : event.target.value})}} readOnly={!this.state.sessionObj.change_password}/>
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
                                            {this.state.sessionObj.change_password || this.state.sessionObj.access_user_settings ? <button type="button" className="submit" onClick={this.handleUpdatePersonalData}>Update</button> : <button type="button" className="submit" disabled >Update</button>}
                                           
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

export default connect(mapStateToProps,null)(withRouter(PersonalSettings))

