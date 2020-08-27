import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { showToast,showConfirm } from '../utils/library'


 class UpdateEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeId : '',
            employeeName : '',
            employeeEmail : '',
            employeePassword : '',
            employeeCompany : '',
            showLoader : false,
            showImportModal : false,
            hasPermissionToChangePassword : false,
            hasPermissionToAccessPersonalSettings : false,
            hasPermissionToAccessCompanyAccount : false,
            hasPermissionToCreateRootLevelFolderInSharedFolder : false,
            hasPermissionToUsePersonalFileBox : false,
            hasPermissionToAccessOtherUserFileBox : false,
            hasPermissionToManageClients : false,
            hasPermissionToManageEmployee : false,
            hasPermissionToAccessCompanyAccountPermission : false,
            hasPermissionToEditSharedAddressBook : false,
            hasPermissionToShareDistributionGroup : false,
            hasPermissionToEditOtherUserDistributionGroup : false,
            hasPermissionToManageSuperUserGroup : false,
            hasPermissionToEditAccountPreference : false,
            hasPermissionToAccessReporting : false,
            hasPermissionToViewNotificationHistory : false,
            hasPermissionToConfigureSingleSignOnSettings : false,
            hasPermissionToViewEditBillingInformation : false,
            hasPermissionToRequestPlanChanges : false,
            hasPermissionToViewReceiptsBillingNotification : false,
            hasPermissionToCreateManageConnectors : false,
            hasPermissionToCreateSharepointConnectors : false,
            hasPermissionToCreateNetworkShareConnectors : false,
            hasPermissionToManageFolderTemplate : false,
            hasPermissionToManageRemoteUploadForms : false,
            hasPermissionToManageFileDrops : false,
            assignedFolder : [],
            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this)
       
      
    }

    

    /**** function defination for submit employees ****/
    handleUpdateEmployee = () =>{
        let isAbleForSubmission = false;

        if( 
            this.state.employeeName != '' && this.state.employeeEmail!='' && this.employeePassword !=''
        ){
            isAbleForSubmission = true
        }

        if(isAbleForSubmission == true){
            if(this.state.assignedFolder.length == 0){
                showConfirm('Are You Sure?','No file assigned','warning',() => {
                    //TODO: add client API call
                })
            }else{
                 //TODO: add client API call
            }
        }else{
            showToast('error','Please provide valid information before adding client')
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
                                            <div className="lft-hdr"><span><i className="fas fa-user-plus"></i></span>Edit Employee</div>
                                            <div className="rght-hdr ">
                                                <Link to="/browse-employees" class="addclient" type="button"> <i class="fas fa-arrow-left"></i> Back</Link>
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
                                                    <div className="CreateEmployee_main_body">
                                                    <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-4">
                                                                        <label>Name</label>
                                                                        <input type="text" className="form-control" placeholder="Name"
                                                                        defaultValue={this.state.employeeName} onBlur={(event) => {this.setState({employeeName : event.target.value})}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Email</label>
                                                                        <input type="text" className="form-control" placeholder="Email" 
                                                                        defaultValue={this.state.employeeEmail} onBlur={(event) => {this.setState({employeeEmail : event.target.value})}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Company(optional)</label>
                                                                        <input type="text" className="form-control" placeholder="Company"
                                                                       defaultValue={this.state.employeeCompany} onBlur={(event) => {this.setState({employeeCompany : event.target.value})}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Password</label>
                                                                        <input type="text" className="form-control" placeholder="Password" 
                                                                        defaultValue={this.state.employeePassword} onBlur={(event) => {this.setState({employeePassword : event.target.value})}}/>
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
                                                <div className="lft-hdr"><span>2</span>User Settings</div>
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToChangePassword}  id="customCheck1" onClick={()=>{this.setState({hasPermissionToChangePassword : !this.state.hasPermissionToChangePassword})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck1">Change Their Password</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToAccessPersonalSettings} id="customCheck2" onClick={()=>{this.setState({hasPermissionToAccessPersonalSettings : !this.state.hasPermissionToAccessPersonalSettings})}}/>
                                                                <label className="custom-control-label" htmlFor="customCheck2">Access Personal Settings</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToAccessCompanyAccount} id="customCheck3" onClick={()=>{this.setState({hasPermissionToAccessCompanyAccount : !this.state.hasPermissionToAccessCompanyAccount})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck3" >Access Company account permission</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToCreateRootLevelFolderInSharedFolder} id="customCheck4" onClick={()=>{this.setState({hasPermissionToCreateRootLevelFolderInSharedFolder : !this.state.hasPermissionToCreateRootLevelFolderInSharedFolder})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck4" >Create root level folders in "Shared Folder"</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToUsePersonalFileBox} id="customCheck4" onClick={()=>{this.setState({hasPermissionToUsePersonalFileBox : !this.state.hasPermissionToUsePersonalFileBox})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck4" >Use Personal File Box</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToAccessOtherUserFileBox} id="customCheck5" onClick={()=>{this.setState({hasPermissionToAccessOtherUserFileBox : !this.state.hasPermissionToAccessOtherUserFileBox})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck5" >Access other user File Box and sent items</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToManageClients} id="customCheck6" onClick={()=>{this.setState({hasPermissionToManageClients : !this.state.hasPermissionToManageClients})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck6" >Manage Clients</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToManageEmployee} id="customCheck7" onClick={()=>{this.setState({hasPermissionToManageEmployee : !this.state.hasPermissionToManageEmployee})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck7" >Manage Employees</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToAccessCompanyAccountPermission} id="customCheck8" onClick={()=>{this.setState({hasPermissionToAccessCompanyAccountPermission : !this.state.hasPermissionToAccessCompanyAccountPermission})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck8" >Access Company account permission</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToEditSharedAddressBook} id="customCheck9" onClick={()=>{this.setState({hasPermissionToEditSharedAddressBook : !this.state.hasPermissionToEditSharedAddressBook})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck9" >Edit shared address book</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToShareDistributionGroup} id="customCheck10" onClick={()=>{this.setState({hasPermissionToShareDistributionGroup : !this.state.hasPermissionToShareDistributionGroup})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck10" >Share Distribution groups</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToEditOtherUserDistributionGroup} id="customCheck11" onClick={()=>{this.setState({hasPermissionToEditOtherUserDistributionGroup : !this.state.hasPermissionToEditOtherUserDistributionGroup})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck11" >Edit other user's distribution group</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToManageSuperUserGroup} id="customCheck12" onClick={()=>{this.setState({hasPermissionToManageSuperUserGroup : !this.state.hasPermissionToManageSuperUserGroup})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck12" >Manage Super user group</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToEditAccountPreference} id="customCheck13" onClick={()=>{this.setState({hasPermissionToEditAccountPreference : !this.state.hasPermissionToEditAccountPreference})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck13" >Edit Account preference</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToAccessReporting} id="customCheck14" onClick={()=>{this.setState({hasPermissionToAccessReporting : !this.state.hasPermissionToAccessReporting})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck14" >Access reporting</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToViewNotificationHistory} id="customCheck15" onClick={()=>{this.setState({hasPermissionToViewNotificationHistory : !this.state.hasPermissionToViewNotificationHistory})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck15" >View notification history</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToConfigureSingleSignOnSettings} id="customCheck16" onClick={()=>{this.setState({hasPermissionToConfigureSingleSignOnSettings : !this.state.hasPermissionToConfigureSingleSignOnSettings})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck16" >Configure single sign-on settings</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToViewEditBillingInformation} id="customCheck17" onClick={()=>{this.setState({hasPermissionToViewEditBillingInformation : !this.state.hasPermissionToViewEditBillingInformation})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck17" >View/Edit billing information</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToRequestPlanChanges} id="customCheck18" onClick={()=>{this.setState({hasPermissionToRequestPlanChanges : !this.state.hasPermissionToRequestPlanChanges})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck18" >Request plan changes</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToViewReceiptsBillingNotification} id="customCheck19" onClick={()=>{this.setState({hasPermissionToViewReceiptsBillingNotification : !this.state.hasPermissionToViewReceiptsBillingNotification})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck19" >View receipts and billing notification</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToCreateManageConnectors} id="customCheck20" onClick={()=>{this.setState({hasPermissionToCreateManageConnectors : !this.state.hasPermissionToCreateManageConnectors})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck20" >Create and manage Connectors</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToCreateSharepointConnectors} id="customCheck21" onClick={()=>{this.setState({hasPermissionToCreateSharepointConnectors : !this.state.hasPermissionToCreateSharepointConnectors})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck21" >Create Sharepoint connectors</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToCreateNetworkShareConnectors} id="customCheck22" onClick={()=>{this.setState({hasPermissionToAccessPersonalSettings : !this.state.hasPermissionToCreateNetworkShareConnectors})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck22" >Create Network share connectors</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToManageFolderTemplate} id="customCheck23" onClick={()=>{this.setState({hasPermissionToManageFolderTemplate : !this.state.hasPermissionToManageFolderTemplate})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck23" >Manage folder template</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToManageRemoteUploadForms} id="customCheck24" onClick={()=>{this.setState({hasPermissionToManageRemoteUploadForms : !this.state.hasPermissionToManageRemoteUploadForms})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck24" >Manage remote upload forms</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToManageFileDrops} id="customCheck25" onClick={()=>{this.setState({hasPermissionToManageFileDrops : !this.state.hasPermissionToManageFileDrops})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck25" >Manage file drops</label>
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
                                                <div className="lft-hdr"><span>3</span>Give User Access To Folders<strong> (Recommended)</strong></div>
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <div className="row">
                                                            <div className="col-md-4">
                                                            <div className="createclient_main_body_item">
                                                                <a href="#!">
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-folder-open"></i></span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Assign Folders</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                            <div className="createclient_main_body_item">
                                                                <a href="#!">
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-user-plus"></i></span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Add to Distribution Group</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                            <div className="createclient_main_body_item">
                                                                <a href="#!">
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-user"></i></span>
                                                                        <span><i className="fas fa-user"></i></span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Copy Folder Access From Existing User</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal_button_area">
                                            <button type="button" className="submit" onClick={this.addEmployees}>Submit</button>
                                            <button type="button" className="cancle" data-dismiss="modal" aria-label="Close">Cancel</button>
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

        /*** SETTING EMPLOYEE'S ID FROM LOCALSTORAGE TO STATE ***/
        let currentPage = localStorage.getItem(SITENAMEALIAS + '_current_page');
        let currentPageArr = currentPage.split('/')
        if(currentPageArr[2] != undefined && currentPageArr[2] != null && currentPageArr[2] != ''){
            this.setState({employeeId : currentPageArr[2]});
        }else{
            showToast('error',"Employee's id missing");
            this.props.history.push('/browse-employees')
        }
       
   }
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

export default connect(mapStateToProps,null)(UpdateEmployee)

