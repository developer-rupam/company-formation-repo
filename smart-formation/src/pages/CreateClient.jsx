import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import readXlsxFile from 'read-excel-file'
import {CreateUser,GetAllSubDirectory,addDirectoryAssignedUser,CreateDirectory} from '../utils/service'
import { connect } from 'react-redux';
import {setPersonalFoldersList} from '../utils/redux/action'

class CreateClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addClientList : [{index : 1, name : '',email : '',company :'',password : ''}],
            showLoader : false,
            hasPermissionToChangePassword : false,
            hasPermissionToAccessPersonalSettings : false,
            showImportModal : false,
            assignedFolder : [],
            personalFolderList : [],
            userType : 'CLIENT',
            userRole : 'CLIENT',
            userCreatedBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            isUserGrouped : false,
            showAssignFolderModal : false,
            folderListWithSearchQuery : [],
            showCreateFolderModal : false,
            assignedUser :[],
            addPeopleToFolder : false,
            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleAddClientRow = this.handleAddClientRow.bind(this)
        this.handleSubmitClient = this.handleSubmitClient.bind(this)
        this.handleDeleteClientRow = this.handleDeleteClientRow.bind(this)
        this.handleCsvFile = this.handleCsvFile.bind(this)
        this.openImportModal = this.openImportModal.bind(this)
        this.closeImportModal = this.closeImportModal.bind(this)
        this.openAssignFolderModal = this.openAssignFolderModal.bind(this)
        this.closeAssignFolderModal = this.closeAssignFolderModal.bind(this)
        this.handleValueChangeInField = this.handleValueChangeInField.bind(this)
        this.addClient = this.addClient.bind(this)
        this.handleSelectFolder = this.handleSelectFolder.bind(this)
        this.isFolderMatched = this.isFolderMatched.bind(this)
        this.isEntityAlreadyAssigned = this.isEntityAlreadyAssigned.bind(this)
        this.assignUserToEntity = this.assignUserToEntity.bind(this)
        this.openCreateFolderModal = this.openCreateFolderModal.bind(this)
        this.closeCreateFolderModal = this.closeCreateFolderModal.bind(this)
        this.handleSubmitForCreateFolder = this.handleSubmitForCreateFolder.bind(this)
        this.fetchAllParentDirectory = this.fetchAllParentDirectory.bind(this)
        this.handleApplyAssignedUser = this.handleApplyAssignedUser.bind(this)

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.folderNameRef = React.createRef();
        this.folderDetailsRef = React.createRef();
      
    }

    /**** function defination for adding clients ****/
    handleAddClientRow = () =>{
        let clientListArr = this.state.addClientList
        let nextIndex = (this.state.addClientList).length+1
        let clientListObj = {index : nextIndex, name: '',email : '',company :'',password : ''}
        clientListArr.push(clientListObj)
        this.setState({addClientList : clientListArr})
    }

    /**** function defination for submit clients ****/
    handleSubmitClient = () =>{
        let isAbleForSubmission = false;

        let clientList = this.state.addClientList;
        for(let i=0;i<clientList.length;i++){
            if(clientList[i].name !='' && clientList[i].email != '' && clientList[i].password != ''){
                isAbleForSubmission = true
            }else{
                isAbleForSubmission = false
            }
        }

        if(isAbleForSubmission == true){
            if(this.state.assignedFolder.length == 0){
                showConfirm('Are You Sure?','No file assigned','warning',() => {
                    this.addClient()
                })
            }else{
                this.addClient()
            }
        }else{
            showToast('error','Please provide valid information before adding client')
        }

      
    }

    /*** FUNXTION DEFINATION FOR STORING CLIENT IN BACKEND ***/
    addClient = () => {
        let clientList = this.state.addClientList
        let payload = [];
        for(let i=0 ;i<clientList.length;i++){
            let obj = {
                "user_name": clientList[i].name,
                "user_email": clientList[i].email,
                "user_company": clientList[i].company,
                "user_password":clientList[i].password,
                "user_type": this.state.userType,
                "user_role":this.state.userRole,
                "created_by":this.state.userCreatedBy,
                "access_user_settings":this.state.hasPermissionToAccessPersonalSettings,
                "change_password":this.state.hasPermissionToChangePassword,
                "is_user_group":this.state.isUserGrouped
            }
            payload.push(obj)
        }
        this.setState({showLoader : true})
        CreateUser(payload).then(function(res){
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                this.setState({showLoader : false})
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                
                setTimeout(() => {
                    this.setState({
                        addClientList : [],
                        hasPermissionToChangePassword : false,
                        hasPermissionToAccessPersonalSettings : false,
                        showLoader : false,
                    })
                    showToast('success','Client added successfully');
                    var insertedUserId = response.lastInsertedIds
                    console.log(insertedUserId)
                    if(this.state.assignedFolder.length != 0){
                        for(let i=0;i<this.state.assignedFolder.length;i++){
                            let iter = this.state.assignedFolder[i]
                            console.log(insertedUserId)
                            for(let j=0;j<insertedUserId.length;j++){

                                this.assignUserToEntity(insertedUserId[j],iter)
                            }
                        }
                    }
                }, 3000);
               
            }
         }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))
    }

    /*** FUNCTION DEFINATION FOR DELETING CLIENT ROW ***/
    handleDeleteClientRow = (param) =>{
       
        let addClientList = this.state.addClientList
        addClientList = addClientList.filter(list => list.index != param)
        this.setState({addClientList:addClientList})
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
            this.setState({addClientList : arr})
            this.closeImportModal()
          })
       }else{
            showToast('error','Please select a valid file')
       }
    }


    /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
    openImportModal = () => {
       this.setState({showImportModal : true})
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
    closeImportModal = () => {
        this.setState({showImportModal : false})
    }
    /*** FUNCTION DEFINATION FOR OPENING ASSIGN FOLDER MODAL ***/
    openAssignFolderModal = () => {
        this.setState({showAssignFolderModal : true})
     }
     /*** FUNCTION DEFINATION FOR CLOSING ASSIGN FOLDER MODAL ***/
     closeAssignFolderModal = () => {
         this.setState({showAssignFolderModal : false,folderListWithSearchQuery : [],assignUser:[]})
     }
     /*** FUNCTION DEFINATION FOR CLOSING ASSIGN FOLDER MODAL ***/
     handleApplyAssignedUser = () => {
         this.setState({showAssignFolderModal : false,folderListWithSearchQuery : []})
         console.log(this.state.assignedUser)
     }

    /*** function defination for changing value and store in state ***/
    handleValueChangeInField = (value,index,key) =>{
       // console.log(e.target.value);
       // console.log(e.target.value);
       let addClientList = this.state.addClientList;
       for(let i=0;i<addClientList.length;i++){
           if(addClientList[i].index == index){
               addClientList[i][key] = value;
           }
       }
       this.setState({addClientList : addClientList})
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
            console.log(this.state.personalFolderList)
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
            showHttpError(err)
        }.bind(this))
    }

    /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
    openCreateFolderModal = () => {
        this.setState({showCreateFolderModal : true})
     }
     /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
     closeCreateFolderModal = () => {
         this.setState({showCreateFolderModal : false})
     }
      /*** FUNCTION DEFINATION TO HANDLE SUBMIT FOR CREATE FOLDER ***/
   handleSubmitForCreateFolder = (e) => {
    e.preventDefault();
    let isAbleToSubmit = false

    console.log(this.folderDetailsRef.current.value)

    if(this.folderDetailsRef.current.value.length > this.state.totalCharacterForFolderDetails){
        showToast('error','Folder Details Exceeded ' + this.state.totalCharacterForFolderDetails + ' characters')
        isAbleToSubmit = false
    
    }else{
        isAbleToSubmit = true
    }

    if(this.folderNameRef.current.value != '' && this.folderNameRef.current.value != undefined){
        isAbleToSubmit = true
    }else{
        isAbleToSubmit = false
    }

    if(isAbleToSubmit){

        let payload = {
            
                "entity_name": this.folderNameRef.current.value,
                "entity_description": this.folderDetailsRef.current.value,
                "parent_directory_id": "",
                "directory_owner": JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id
        
        }

        this.setState({showLoader : true})
        CreateDirectory(payload).then(function(res){
            var response = res.data;
            this.setState({showLoader : false})
            if(response.errorResponse.errorStatusCode != 1000){
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                showToast('success','Folder created successfully');
                this.folderNameRef.current.value = ''
                this.folderDetailsRef.current.value = ''
                this.setState({showCreateFolderModal : false})
                var insertedEntityId = response.lastRecordId
                console.log(insertedEntityId)
                if(this.state.addPeopleToFolder){
                    let folderArr = this.state.assignedFolder
                    folderArr.push(insertedEntityId)
                    this.setState({assignedFolder : folderArr})
                }
                this.fetchAllParentDirectory()
                
            }
        }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))
    }else{
        showToast('error','Please provide valid information')
    }
}


/*** FUNCTION DEFINATION TO GET ALL PARENT DIRECTORY AS PER AS USER TYPE ***/
fetchAllParentDirectory = () => {
let payload = {entity_id : ''}
this.setState({showLoader : true})
GetAllSubDirectory(payload).then(function(res){
            var response = res.data;
            this.setState({showLoader : false})
            if(response.errorResponse.errorStatusCode != 1000){
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                
                let arr = [];
                let folders = response.response
                for(let i=0;i<folders.length;i++){
                    
                    if(folders[i].directory_owner == JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id){
                        arr.push(folders[i]);
                    }
                }
                this.setState({personalFolderList : arr})
                this.props.setPersonalFoldersList(this.state.personalFolderList);
                console.log(this.state.personalFolderList)
                console.log(this.props.globalState)
                
            }
        }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))
}

 /*** function defination for handling or set assign new created folder to current employee ****/
  handleAssignToCurrentUser = () => {
      this.setState({addPeopleToFolder : !this.state.addPeopleToFolder})
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
                                            <div className="lft-hdr"><span><i className="fas fa-user-plus"></i></span>Create New Client</div>
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
                                                    <div className="createclient_main_body">
                                                    {this.state.addClientList.map((list) =>
                                                        <form key={list.index}>
                                                            <div className="detailcreate_area">
                                                            <span className="delete_add_row" onClick={() => this.handleDeleteClientRow(list.index)}><i className="fas fa-trash"></i></span>
                                                            
                                                                <div className="form-row addClientRow" >
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
                                                            <button type="button" onClick={this.handleAddClientRow}><i className="fas fa-plus"></i>Add Another</button>
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
                                                            <input type="checkbox" className="custom-control-input" id="customCheck1" defaultChecked={this.state.hasPermissionToChangePassword} onClick={()=>{this.setState({hasPermissionToChangePassword : !this.state.hasPermissionToChangePassword})}}/>
                                                            <label className="custom-control-label" htmlFor="customCheck1">Change Their Password</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck2" defaultChecked={this.state.hasPermissionToAccessPersonalSettings} onClick={()=>{this.setState({hasPermissionToAccessPersonalSettings : !this.state.hasPermissionToAccessPersonalSettings})}}/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Access Personal Settings</label>
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
                                                           {JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_type === 'ADMIN' && <div className="col-md-4">
                                                            <div className="createclient_main_body_item">
                                                            <a href="javascript:void(0)" onClick={this.openCreateFolderModal}>
                                                                    <div className="createclient_main_body_item_icon">
                                                                        <span><i className="fas fa-user-plus"></i></span>
                                                                    </div>
                                                                    <div className="createclient_main_body_item_content">
                                                                        <span>Add Folder</span>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                            </div>}
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
                                            <button type="button" className="submit" onClick={this.handleSubmitClient}>Submit</button>
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
                            <div className="modal_button_area">

                            <button type="button" className="submit" onClick={this.openCreateFolderModal} >Create New Folder</button>  
                            <button type="button" className="cancle" onClick={this.handleApplyAssignedUser}>Apply</button>  
                            </div>
                        </div>
                        </Modal.Body>
                        
                    </Modal>

                    <Modal
                        show={this.state.showCreateFolderModal}
                        onHide={this.closeCreateFolderModal}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Create Folder</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="modal_cera_folder_area">
                     <form onSubmit = {this.handleSubmitForCreateFolder}>
                        <div className="form-group">
                           <label>Name</label>
                           <input type="text" className="form-control" placeholder="Name" ref={this.folderNameRef} />
                        </div>
                        <div className="form-group">
                           <label>Details</label>
                           <textarea className="form-control"rows="5" placeholder="Details" ref={this.folderDetailsRef} ></textarea>
                            <small className="form-text text-muted text-right">Character Limit: {this.state.totalCharacterForFolderDetails}</small>
                        </div>
                        <div className="form-group">
                           <label>Add Current Client To Folder</label>
                           <div>
                              <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="AddPeople" value="true" checked ={this.state.addPeopleToFolder == true} onClick={this.handleAssignToCurrentUser}/>
                                 <label className="form-check-label">Yes</label>
                              </div>
                              <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="AddPeople" value="false" checked ={this.state.addPeopleToFolder == false} onClick={this.handleAssignToCurrentUser}/>
                                 <label className="form-check-label">No</label>
                              </div>
                           </div>
                        </div>
                        {/* <div className="form-group">
                           <label>Apply Template</label>
                           <div className="form-check">
                              <input className="form-check-input" type="radio" name="Template" value="Do Not Use A Folder Template" checked/>
                              <label className="form-check-label">
                              Do Not Use A Folder Template
                              </label>
                           </div>
                           <div className="form-check">
                              <input className="form-check-input" type="radio" name="Template" value="Use A Folder Template"/>
                              <label className="form-check-label">
                              Use A Folder Template
                              </label>
                           </div>
                        </div> */}
                        <div className="modal_button_area">
                           <button type="submit" className="submit">Create Folder</button>
                           <button type="button" className="cancle" data-dismiss="modal" aria-label="Close" onClick={this.closeCreateFolderModal}>Cancel</button>
                        </div>
                     </form>
                  </div>
                        </Modal.Body>
                        
                    </Modal>

                <Footer/>
                <Loader show={this.state.showLoader}/>
               </Fragment>
               
        )
    }

    componentDidMount(){

        /*** render personal folder list ***/
        if(this.props.globalState.personalFoldersReducer.length != 0 && this.props.globalState.personalFoldersReducer != undefined){
            var folders = this.props.globalState.personalFoldersReducer.list;
            let foldersArray =[];
            for(let i=0;i<folders.length;i++){
                foldersArray.push(folders[i])
            }
            this.setState({personalFolderList : foldersArray})
        }else{
            let payload = {entity_id : ''}
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
                        showHttpError(err)
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

export default connect(mapStateToProps,mapDispatchToProps)(CreateClient)

