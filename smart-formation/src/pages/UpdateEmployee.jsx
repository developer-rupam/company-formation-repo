import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import {UpdateEmployeeService,GetAllSubDirectory,addDirectoryAssignedUser} from '../utils/service'
import { Modal } from 'react-bootstrap';
import {setPersonalFoldersList} from '../utils/redux/action'


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
            personalFolderList : [],
            userCreatedBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            isUserGrouped : false,
            userRole : 'EMPLOYEE',
            userType : 'EMPLOYEE',
            showAssignFolderModal : false,
            folderListWithSearchQuery : [],
            page : 1,
            noOfItemsPerPage : 50,
            totalCount : 0,
            sort : -1

            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this)
        this.getSelectedEmployeeDetails = this.getSelectedEmployeeDetails.bind(this)
        this.updateEmployee = this.updateEmployee.bind(this)
        this.openAssignFolderModal = this.openAssignFolderModal.bind(this)
        this.closeAssignFolderModal = this.closeAssignFolderModal.bind(this)
        this.handleSelectFolder = this.handleSelectFolder.bind(this)
        this.isFolderMatched = this.isFolderMatched.bind(this)
        this.isEntityAlreadyAssigned = this.isEntityAlreadyAssigned.bind(this)
        this.assignUserToEntity = this.assignUserToEntity.bind(this)
       
      
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
                    this.updateEmployee();
                })
            }else{
                 this.updateEmployee();
            }
        }else{
            showToast('error','Please provide valid information before adding client')
        }
    }

     /*** FUNCTION DEFINATION TO GET SELECTED EMPLOYEE'S DETAILS ***/
     getSelectedEmployeeDetails = (param) => {
        var employeesList = this.props.globalState.employeeListReducer.employeesList
        console.log(employeesList)
        if(employeesList != undefined && employeesList.length != 0){
            console.log(employeesList.length)
            for(let i=0;i<employeesList.length;i++){
                if(employeesList[i].employee_id === param){
                    console.log(employeesList[i].employee_id+'  ____ '+param)
                    console.log(employeesList[i])
                    this.setState({showLoader : true})
                    setTimeout(() => {
                        
                        this.setState({
                            employeeName : employeesList[i].employee_name,
                            employeeEmail : employeesList[i].employee_email,
                            employeePassword : employeesList[i].employee_password,
                            employeeCompany : employeesList[i].employee_company,
                            hasPermissionToChangePassword:employeesList[i].change_password,
                            hasPermissionToAccessPersonalSettings:employeesList[i].access_employee_settings,
                            hasPermissionToAccessCompanyAccount : employeesList[i].access_company_account_setting,
                            hasPermissionToCreateRootLevelFolderInSharedFolder : employeesList[i].create_root_level_folder,
                            hasPermissionToUsePersonalFileBox : employeesList[i].use_personal_file_box,
                            hasPermissionToAccessOtherUserFileBox : employeesList[i].access_others_file_box,
                            hasPermissionToManageClients : employeesList[i].manage_client,
                            hasPermissionToManageEmployee : employeesList[i].manage_employee,
                            hasPermissionToAccessCompanyAccountPermission : employeesList[i].access_company_account,
                            hasPermissionToEditSharedAddressBook : employeesList[i].edit_shared_address_book,
                            hasPermissionToShareDistributionGroup : employeesList[i].share_distribution_groups,
                            hasPermissionToEditOtherUserDistributionGroup : employeesList[i].edit_other_distribution_groups,
                            hasPermissionToManageSuperUserGroup : employeesList[i].manage_super_user_group,
                            hasPermissionToEditAccountPreference : employeesList[i].edit_account_preference,
                            hasPermissionToAccessReporting : employeesList[i].access_reporting,
                            hasPermissionToViewNotificationHistory : employeesList[i].view_notification_history,
                            hasPermissionToConfigureSingleSignOnSettings : employeesList[i].configure_single_sign_on,
                            hasPermissionToViewEditBillingInformation : employeesList[i].view_edit_billing_information,
                            hasPermissionToRequestPlanChanges : employeesList[i].request_plan_changes,
                            hasPermissionToViewReceiptsBillingNotification : employeesList[i].view_receipt_billing_notification,
                            hasPermissionToCreateManageConnectors : employeesList[i].create_manage_connectors,
                            hasPermissionToCreateSharepointConnectors : employeesList[i].create_sharepoint_connectors,
                            hasPermissionToCreateNetworkShareConnectors : employeesList[i].create_network_share_connectors,
                            hasPermissionToManageFolderTemplate : employeesList[i].manage_folder_template,
                            hasPermissionToManageRemoteUploadForms : employeesList[i].manage_remote_upload_form,
                            hasPermissionToManageFileDrops : employeesList[i].manage_file_drop,
                            showLoader : false,
                            userCreatedBy : employeesList[i].created_by
                        })
                        
                    }, 5000);
                    break;
                }
            }
        }else{
            
            showToast('error','Rendering error please go back to browse clients')
        }
    }

    /*** FUNCTION DEFINATION TO CALL API FOR EMPLOYEE UPDATION ***/
    updateEmployee = () => {
        let payload = {
                "employee_id" : this.state.employeeId,
                "employee_name": this.state.employeeName,
                "employee_email": this.state.employeeEmail,
                "employee_password":this.state.employeePassword,
                "employee_company": this.state.employeeCompany,
                "user_type": this.state.userType,
                "user_role": this.state.userRole,
                "created_by": this.state.userCreatedBy,
                "access_employee_settings": this.state.hasPermissionToAccessPersonalSettings,
                "change_password": this.state.hasPermissionToChangePassword,
                "access_company_account_setting": this.state.hasPermissionToAccessCompanyAccount,
                "create_root_level_folder": this.state.hasPermissionToCreateRootLevelFolderInSharedFolder,
                "use_personal_file_box": this.state.hasPermissionToUsePersonalFileBox,
                "access_others_file_box": this.state.hasPermissionToAccessOtherUserFileBox,
                "manage_client": this.state.hasPermissionToManageClients,
                "manage_employee": this.state.hasPermissionToManageEmployee,
                "access_company_account": this.state.hasPermissionToAccessCompanyAccountPermission,
                "edit_shared_address_book": this.state.hasPermissionToEditSharedAddressBook,
                "share_distribution_groups": this.state.hasPermissionToShareDistributionGroup,
                "edit_other_distribution_groups": this.state.hasPermissionToEditOtherUserDistributionGroup,
                "manage_super_user_group": this.state.hasPermissionToManageSuperUserGroup,
                "edit_account_preference": this.state.hasPermissionToEditAccountPreference,
                "access_reporting": this.state.hasPermissionToAccessReporting,
                "view_notification_history": this.state.hasPermissionToViewNotificationHistory,
                "configure_single_sign_on": this.state.hasPermissionToConfigureSingleSignOnSettings,
                "view_edit_billing_information": this.state.hasPermissionToViewEditBillingInformation,
                "request_plan_changes": this.state.hasPermissionToRequestPlanChanges,
                "view_receipt_billing_notification": this.state.hasPermissionToViewReceiptsBillingNotification,
                "create_manage_connectors": this.state.hasPermissionToCreateManageConnectors,
                "create_sharepoint_connectors": this.state.hasPermissionToCreateSharepointConnectors,
                "create_network_share_connectors": this.state.hasPermissionToCreateNetworkShareConnectors,
                "manage_folder_template": this.state.hasPermissionToManageFolderTemplate,
                "manage_remote_upload_form": this.state.hasPermissionToManageRemoteUploadForms,
                "manage_file_drop": this.state.hasPermissionToManageFileDrops,
               
            }
            console.log(payload)
        this.setState({showLoader : true})
        UpdateEmployeeService(payload).then(function(res){
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                this.setState({showLoader : false})
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                showToast('success','Employee updated successfully');
                document.getElementById('backBtn').click();
                if(this.state.assignedFolder.length != 0){
                    for(let i=0;i<this.state.assignedFolder.length;i++){
                        let iter = this.state.assignedFolder[i]
                       // for(let j=0;j<insertedUserId.length;j++){

                            this.assignUserToEntity(this.state.employeeId,iter)
                       // }
                    }
                }
            }
         }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err,this.props)
        }.bind(this))
    }
    
 
    /*** FUNCTION DEFINATION FOR OPENING ASSIGN FOLDER MODAL ***/
    openAssignFolderModal = () => {
        this.setState({showAssignFolderModal : true})
     }
     /*** FUNCTION DEFINATION FOR CLOSING ASSIGN FOLDER MODAL ***/
     closeAssignFolderModal = () => {
        this.setState({showAssignFolderModal : false,folderListWithSearchQuery : []})
    }
    /*** FUNCTION DEFINATION TO SELECT FOLDER ***/
    handleSelectFolder = (param) =>{
        let arr = this.state.assignedFolder
        console.log(arr.includes(param))
        if(!arr.includes(param)){
            arr.push(param);
        }else{
            let index = arr.indexOf(param);
            console.log(index)
            if (index > -1) {
            arr.splice(index, 1);
            }
        }
        this.setState({assignedFolder : arr})
        console.log(this.state.assignedFolder)
    }

    /*** FUNCTION DEFINATION TO MATCH FOLDER NAME WITH GIVEN INPUT ***/
    isFolderMatched = (param) => {
        let arr =[]
        if(param!='' ){
            for(let i=0;i<this.state.personalFolderList.length;i++){
                let iter = this.state.personalFolderList[i]
                if((iter.entity_name).toLowerCase().indexOf((param).toLowerCase()) != -1){
                   arr.push(iter)
                }
            }
        }else{
        }
        this.setState({folderListWithSearchQuery : arr})
        //console.log(this.state.folderListWithSearchQuery)
    }

    /*** FUNCTION DEFINATION TO CHECK IF A FOLDER IS ALREADY ASSIGNED ****/
    isEntityAlreadyAssigned = (param) => {
        if(this.state.assignedFolder.includes(param)){
            return true
        }else{
            return false
        }
    }

    /*** FUNCTION DEFINATION TO CALL API FOR ASSIGNING FOLDER TO USER ***/
    assignUserToEntity = (userId,entityId) => {
        let arr = []
        arr.push(userId)
        let payload = {
            entity_id : entityId,
            user_ids : arr
        }
        this.setState({showLoader : true})
        addDirectoryAssignedUser(payload).then(function(res){
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                this.setState({showLoader : false})
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                
                setTimeout(() => {
                    this.setState({
                    
                        assignedFolder : [],
                        showLoader : false,
                    })
                    showToast('success','Folder Assigned Successfully');
                }, 3000);
               
            }
         }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err,this.props)
        }.bind(this))
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
                                                <Link to="/browse-employees" class="addclient" type="button" id="backBtn"> <i class="fas fa-arrow-left"></i> Back</Link>
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
                                                                        defaultValue={this.state.employeeEmail} onBlur={(event) => {this.setState({employeeEmail : event.target.value})}} />
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
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToChangePassword}  id="customCheck1" onClick={()=>{this.setState({hasPermissionToChangePassword : !this.state.hasPermissionToChangePassword})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck1">Change Their Password</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToAccessPersonalSettings} id="customCheck2" onClick={()=>{this.setState({hasPermissionToAccessPersonalSettings : !this.state.hasPermissionToAccessPersonalSettings})}}/>
                                                                <label className="custom-control-label" htmlFor="customCheck2">Access Personal Settings</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToAccessCompanyAccount} id="customCheck3" onClick={()=>{this.setState({hasPermissionToAccessCompanyAccount : !this.state.hasPermissionToAccessCompanyAccount})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck3" >Access Company account permission</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToCreateRootLevelFolderInSharedFolder} id="customCheck24" onClick={()=>{this.setState({hasPermissionToCreateRootLevelFolderInSharedFolder : !this.state.hasPermissionToCreateRootLevelFolderInSharedFolder})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck24" >Create root level folders in "Shared Folder"</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToUsePersonalFileBox} id="customCheck4" onClick={()=>{this.setState({hasPermissionToUsePersonalFileBox : !this.state.hasPermissionToUsePersonalFileBox})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck4" >Use Personal File Box</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToAccessOtherUserFileBox} id="customCheck5" onClick={()=>{this.setState({hasPermissionToAccessOtherUserFileBox : !this.state.hasPermissionToAccessOtherUserFileBox})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck5" >Access other user File Box and sent items</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToManageClients} id="customCheck6" onClick={()=>{this.setState({hasPermissionToManageClients : !this.state.hasPermissionToManageClients})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck6" >Manage Clients</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToManageEmployee} id="customCheck7" onClick={()=>{this.setState({hasPermissionToManageEmployee : !this.state.hasPermissionToManageEmployee})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck7" >Manage Employees</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToAccessCompanyAccountPermission} id="customCheck8" onClick={()=>{this.setState({hasPermissionToAccessCompanyAccountPermission : !this.state.hasPermissionToAccessCompanyAccountPermission})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck8" >Access Company account permission</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToEditSharedAddressBook} id="customCheck9" onClick={()=>{this.setState({hasPermissionToEditSharedAddressBook : !this.state.hasPermissionToEditSharedAddressBook})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck9" >Edit shared address book</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToShareDistributionGroup} id="customCheck10" onClick={()=>{this.setState({hasPermissionToShareDistributionGroup : !this.state.hasPermissionToShareDistributionGroup})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck10" >Share Distribution groups</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToEditOtherUserDistributionGroup} id="customCheck11" onClick={()=>{this.setState({hasPermissionToEditOtherUserDistributionGroup : !this.state.hasPermissionToEditOtherUserDistributionGroup})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck11" >Edit other user's distribution group</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToManageSuperUserGroup} id="customCheck12" onClick={()=>{this.setState({hasPermissionToManageSuperUserGroup : !this.state.hasPermissionToManageSuperUserGroup})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck12" >Manage Super user group</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToEditAccountPreference} id="customCheck13" onClick={()=>{this.setState({hasPermissionToEditAccountPreference : !this.state.hasPermissionToEditAccountPreference})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck13" >Edit Account preference</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToAccessReporting} id="customCheck14" onClick={()=>{this.setState({hasPermissionToAccessReporting : !this.state.hasPermissionToAccessReporting})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck14" >Access reporting</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToViewNotificationHistory} id="customCheck15" onClick={()=>{this.setState({hasPermissionToViewNotificationHistory : !this.state.hasPermissionToViewNotificationHistory})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck15" >View notification history</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToConfigureSingleSignOnSettings} id="customCheck16" onClick={()=>{this.setState({hasPermissionToConfigureSingleSignOnSettings : !this.state.hasPermissionToConfigureSingleSignOnSettings})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck16" >Configure single sign-on settings</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToViewEditBillingInformation} id="customCheck17" onClick={()=>{this.setState({hasPermissionToViewEditBillingInformation : !this.state.hasPermissionToViewEditBillingInformation})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck17" >View/Edit billing information</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToRequestPlanChanges} id="customCheck18" onClick={()=>{this.setState({hasPermissionToRequestPlanChanges : !this.state.hasPermissionToRequestPlanChanges})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck18" >Request plan changes</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToViewReceiptsBillingNotification} id="customCheck19" onClick={()=>{this.setState({hasPermissionToViewReceiptsBillingNotification : !this.state.hasPermissionToViewReceiptsBillingNotification})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck19" >View receipts and billing notification</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToCreateManageConnectors} id="customCheck20" onClick={()=>{this.setState({hasPermissionToCreateManageConnectors : !this.state.hasPermissionToCreateManageConnectors})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck20" >Create and manage Connectors</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToCreateSharepointConnectors} id="customCheck21" onClick={()=>{this.setState({hasPermissionToCreateSharepointConnectors : !this.state.hasPermissionToCreateSharepointConnectors})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck21" >Create Sharepoint connectors</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToCreateNetworkShareConnectors} id="customCheck22" onClick={()=>{this.setState({hasPermissionToCreateNetworkShareConnectors : !this.state.hasPermissionToCreateNetworkShareConnectors})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck22" >Create Network share connectors</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToManageFolderTemplate} id="customCheck23" onClick={()=>{this.setState({hasPermissionToManageFolderTemplate : !this.state.hasPermissionToManageFolderTemplate})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck23" >Manage folder template</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToManageRemoteUploadForms} id="customCheck24" onClick={()=>{this.setState({hasPermissionToManageRemoteUploadForms : !this.state.hasPermissionToManageRemoteUploadForms})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck24" >Manage remote upload forms</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                                <input type="checkbox" className="custom-control-input" checked={this.state.hasPermissionToManageFileDrops} id="customCheck25" onClick={()=>{this.setState({hasPermissionToManageFileDrops : !this.state.hasPermissionToManageFileDrops})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck25" >Manage file drops</label>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        {JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_type == 'ADMIN' ?<div className="card card_cstm same_dv_table cust_back_card">
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
                                                                <a href="javascript:void(0)" onClick={this.openAssignFolderModal}>
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-folder-open"></i></span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Assign Folders</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            </div>
                                                           {/* < div className="col-md-4">
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
                                                            </div> */}
                                                            {/* <div className="col-md-4">
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
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div> : '' }
                                        <div className="modal_button_area">
                                            <button type="button" className="submit" onClick={this.handleUpdateEmployee}>Update</button>
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
                

                <Modal
                        show={this.state.showAssignFolderModal}
                        onHide={this.closeAssignFolderModal}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Assign Folder</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="importmodal_content">
                        <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Search Folder" onKeyUp={(event)=>{this.isFolderMatched(event.target.value)}}/>
                       {/*  <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button">Search</button>
                        </div> */}
                        </div>
                            <ul className="">
                              {this.state.folderListWithSearchQuery.map((list) =>
                                <li className="list-group-item" key={list.entity_id}>
                                  <div className="row">
                                      <div className="col-md-2">
                                          <input type="checkbox" checked={this.isEntityAlreadyAssigned(list.entity_id) ? 'checked' : ''} onClick={()=>{this.handleSelectFolder(list.entity_id)}}/>
                                      </div>
                              <div className="col-md-8">{list.entity_name}</div>
                                  </div>
                              </li> )}
                            </ul>   
                        </div>
                        </Modal.Body>
                        
                    </Modal>


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
            this.setState({employeeId : currentPageArr[2]},()=>{
                console.log(this.state.employeeId)
                this.getSelectedEmployeeDetails(this.state.employeeId)
            });
            
        }else{
            showToast('error',"Employee's id missing");
            this.props.history.push('/browse-employees')
        }


        /*** render personal folder list ***/
        if(this.props.globalState.personalFoldersReducer.length != 0 && this.props.globalState.personalFoldersReducer != undefined){
            var folders = this.props.globalState.personalFoldersReducer.list;
            let foldersArray =[];
            for(let i=0;i<folders.length;i++){
                foldersArray.push(folders[i])
            }
            this.setState({personalFolderList : foldersArray})
        }else{
            let payload = {entity_id : '',page : this.state.page,limit:this.state.noOfItemsPerPage,sort:this.state.sort,searchQuery:this.state.searchQuery,asigned_user_id:''}
            this.setState({showLoader : true})
            GetAllSubDirectory(payload).then(function(res){
                        var response = res.data;
                        this.setState({showLoader : false})
                        if(response.errorResponse.errorStatusCode != 1000){
                            showToast('error',response.errorResponse.errorStatusType);
                        }else{
                            
                            let arr = [];
                            let iter = response.response
                            for(let i=0;i<iter.length;i++){
                                    arr.push(iter[i]);
                                
                            }
                            this.props.setPersonalFoldersList(arr);
                            var folders = this.props.globalState.personalFoldersReducer.list;
                            let foldersArray =[];
                            for(let i=0;i<folders.length;i++){
                                foldersArray.push(folders[i])
                            }
                            this.setState({personalFolderList : foldersArray})
                            
                        }
                    }.bind(this)).catch(function(err){
                        this.setState({showLoader : false})
                        showHttpError(err,this.props)
                    }.bind(this))
        }
       
   }
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setPersonalFoldersList : (array) => dispatch(setPersonalFoldersList(array)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(UpdateEmployee)

