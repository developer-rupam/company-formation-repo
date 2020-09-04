import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import readXlsxFile from 'read-excel-file'
import {CreateEmployeeService} from '../utils/service'


export default class CreateEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addEmployeeList : [{index : 1, name : '',email : '',company :'',password : ''}],
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
            userType : 'EMPLOYEE',
            userRole : 'EMPLOYEE',
            userCreatedBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            isUserGrouped : false
            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleAddEmployeeRow = this.handleAddEmployeeRow.bind(this)
        this.handleSubmitEmployee = this.handleSubmitEmployee.bind(this)
        this.handleDeleteEmployeeRow = this.handleDeleteEmployeeRow.bind(this)
        this.handleCsvFile = this.handleCsvFile.bind(this)
        this.openImportModal = this.openImportModal.bind(this)
        this.closeImportModal = this.closeImportModal.bind(this)
        this.handlePermissionChange = this.handlePermissionChange.bind(this)
        this.addEmployee = this.addEmployee.bind(this)
        this.handleValueChangeInField = this.handleValueChangeInField.bind(this)
      
    }

    /**** function defination for adding employees ****/
    handleAddEmployeeRow = () =>{
        let employeeListArr = this.state.addEmployeeList
        let nextIndex = (this.state.addEmployeeList).length+1
        let employeeListObj = {index : nextIndex, name: '',email : '',company :'',password : ''}
        employeeListArr.push(employeeListObj)
        this.setState({addEmployeeList : employeeListArr})
    }

    /**** function defination for submit employees ****/
    handleSubmitEmployee = () =>{
        let isAbleForSubmission = false;

        let employeeList = this.state.addEmployeeList;
        for(let i=0;i<employeeList.length;i++){
            console.log(employeeList[i].name + ' #### ' +employeeList[i].email+ ' #### '+employeeList[i].password)
            if(employeeList[i].name !='' && employeeList[i].email != '' && employeeList[i].password != ''){
                isAbleForSubmission = true
            }else{
                isAbleForSubmission = false
            }
        }

        if(isAbleForSubmission == true){
            if(this.state.assignedFolder.length == 0){
                showConfirm('Are You Sure?','No file assigned','warning',() => {
                    this.addEmployee()
                })
            }else{
                this.addEmployee()
            }
        }else{
            showToast('error','Please provide valid information before adding client')
        }
    }

    /*** FUNCTION DEFINATION FOR STORING EMPLOYEE IN BACKEND ***/
    addEmployee = () => {
        let employeeList = this.state.addEmployeeList
        let payload = [];
        for(let i=0 ;i<employeeList.length;i++){
            let obj = {
                
                "employee_name": employeeList[i].name,
                "employee_email": employeeList[i].email,
                "employee_password": employeeList[i].password,
                "employee_company": employeeList[i].company,
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
                "manage_file_drop": this.state.hasPermissionToManageFileDrops
            }
            payload.push(obj)
        }
        this.setState({showLoader : true})
        CreateEmployeeService(payload).then(function(res){
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                this.setState({showLoader : false})
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                
                setTimeout(() => {
                    this.setState({
                        addEmployeeList : [],
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
                        showLoader : false,
                    })
                    showToast('success','Client added successfully');
                }, 3000);
               
            }
         }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))
    }

    /*** FUNCTION DEFINATION FOR DELETING EMPLOYEE ROW ***/
    handleDeleteEmployeeRow = (param) =>{
       
        let addEmployeeList = this.state.addEmployeeList
        addEmployeeList = addEmployeeList.filter(list => list.index != param)
        this.setState({addEmployeeList:addEmployeeList})
    }

     /*** FUNCTION DEFINATION FOR HANDLING CSV FILE TO ADD CLIENT ***/
     handleCsvFile = () => {
        let file = document.getElementById('uploadFile');
        let type = (file.files[0].name.split('.'))[1];
        if(type == 'xls' || type == 'xlsx' ){
         readXlsxFile(file.files[0]).then((rows) => {
             let arr = [];
             for(let i=0;i<rows.length;i++){
                 if(i != 0){
                     let obj = {
                         index : i,
                         name : rows[i][0],
                         email : rows[i][1],
                         company : rows[i][2],
                         password : rows[i][3],
                     } 
                     arr.push(obj);
                     
                 }
             }
             console.log(arr)
             this.setState({addEmployeeList : arr})
             this.closeImportModal()
           })
        }else{
             showToast('error','Please select a valid file')
        }
     }
 
     /*** function defination for changing value and store in state ***/
    handleValueChangeInField = (value,index,key) =>{
        // console.log(e.target.value);
        // console.log(e.target.value);
        let addEmployeeList = this.state.addEmployeeList;
        for(let i=0;i<addEmployeeList.length;i++){
            if(addEmployeeList[i].index == index){
                addEmployeeList[i][key] = value;
            }
        }
        this.setState({addEmployeeList : addEmployeeList})
     }
 
     /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
     openImportModal = () => {
        this.setState({showImportModal : true})
     }
     /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
     closeImportModal = () => {
         this.setState({showImportModal : false})
     }

     /**** FUNCTION DEFINATION TO CHANGE PERMISSION ****/
     handlePermissionChange = (key,value) =>{
       
     
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
                                            <div className="lft-hdr"><span><i className="fas fa-user-plus"></i></span>Create New Employee</div>
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_addclientmain">
                                        <div className="card card_cstm same_dv_table cust_back_card">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                <div className="lft-hdr"><span>1</span>Basic Info</div>
                                                <div className="addbutton">
                                                    <button type="button" onClick={this.openImportModal} className="addclient"><i className="fas fa-user-plus"></i>Import Multiple Users With Excel</button>
                                                </div>
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="CreateEmployee_main_body">
                                                    {this.state.addEmployeeList.map((list) =>
                                                        <form key={list.index}>
                                                            <div className="detailcreate_area">
                                                            <span className="delete_add_row" onClick={() => this.handleDeleteEmployeeRow(list.index)}><i className="fas fa-trash"></i></span>
                                                            
                                                                <div className="form-row addEmployeeRow" >
                                                                    <div className="form-group col-md-4">
                                                                        <label>Name</label>
                                                                        <input type="text" className="form-control" placeholder="Name"
                                                                        defaultValue={list.name} onBlur={(event) => {this.handleValueChangeInField(event.target.value,list.index,'name')}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Email</label>
                                                                        <input type="text" className="form-control" placeholder="Email" 
                                                                        defaultValue={list.email} onBlur={(event) => {this.handleValueChangeInField(event.target.value,list.index,'email')}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Company(optional)</label>
                                                                        <input type="text" className="form-control" placeholder="Company"
                                                                        defaultValue={list.company} onBlur={(event) => {this.handleValueChangeInField(event.target.value,list.index,'company')}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Password</label>
                                                                        <input type="text" className="form-control" placeholder="Password" 
                                                                        defaultValue={list.password} onBlur={(event) => {this.handleValueChangeInField(event.target.value,list.index,'password')}}/>
                                                                    </div>
                                                                </div>
                                                            
                                                            </div>
                                                        </form>
                                                        )}
                                                        <div className="add_new_row">
                                                            <button type="button" onClick={this.handleAddEmployeeRow}><i className="fas fa-plus"></i>Add Another</button>
                                                        </div>
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
                                                                <input type="checkbox" className="custom-control-input" defaultChecked={this.hasPermissionToUsePersonalFileBox} id="customCheck24" onClick={()=>{this.setState({hasPermissionToUsePersonalFileBox : !this.state.hasPermissionToUsePersonalFileBox})}} />
                                                                <label className="custom-control-label" htmlFor="customCheck24" >Use Personal File Box</label>
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
                                            <button type="button" className="submit" onClick={this.handleSubmitEmployee}>Submit</button>
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
                        show={this.state.showImportModal}
                        onHide={this.closeImportModal}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Import Multiple Users With Excel</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="importmodal_content">
                                    <div className="importmodal_contentfirst">
                                        <strong>Step 1</strong>
                                        <p>To Add Multiple Users Download the <a href="#!">Template Spreadsheet</a> And Add As Many users as desired</p>
                                    </div>
                                    <div className="importmodal_contentsecond">
                                        <strong>Step 2</strong>
                                        <form>
                                        <div className="form-group">
                                            <label>Upload The Completed Excel Spreadsheet</label>
                                           
                                             <input type="file" className="form-control-file" id="uploadFile"/> 
                                         
                                        </div>
                                        <div className="modal_button_area">
                                            <button type="button" className="submit" onClick={this.handleCsvFile}>Import Users</button>
                                            <button type="button" className="cancle" onClick={this.closeImportModal}>Cancel</button>
                                        </div>
                                        </form>
                                    </div>
                                </div>
                        </Modal.Body>
                        
                    </Modal>
                <Footer/>
                <Loader show={this.state.showLoader}/>
               </Fragment>
               
        )
    }

   
    
}

