import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { Modal } from 'react-bootstrap';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SITENAMEALIAS } from '../utils/init';
import {UpdateUser,addDirectoryAssignedUser,GetAllSubDirectory,CreateDirectory} from '../utils/service'
import {setPersonalFoldersList} from '../utils/redux/action'


 class UpdateClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId : '',
            clientName : '',
            clientEmail : '',
            clientPassword : '',
            clientCompany : '',
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
        this.handleUpdateClient = this.handleUpdateClient.bind(this)
        this.getSelectedClientDetails = this.getSelectedClientDetails.bind(this)
        this.updateClient = this.updateClient.bind(this)
        this.handleSelectFolder = this.handleSelectFolder.bind(this)
        this.isFolderMatched = this.isFolderMatched.bind(this)
        this.isEntityAlreadyAssigned = this.isEntityAlreadyAssigned.bind(this)
        this.assignUserToEntity = this.assignUserToEntity.bind(this)
        this.openAssignFolderModal = this.openAssignFolderModal.bind(this)
        this.closeAssignFolderModal = this.closeAssignFolderModal.bind(this)
        this.openCreateFolderModal = this.openCreateFolderModal.bind(this)
        this.closeCreateFolderModal = this.closeCreateFolderModal.bind(this)
        this.handleSubmitForCreateFolder = this.handleSubmitForCreateFolder.bind(this)
        this.fetchAllParentDirectory = this.fetchAllParentDirectory.bind(this)
        this.handleApplyAssignedUser = this.handleApplyAssignedUser.bind(this)

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.folderNameRef = React.createRef();
        this.folderDetailsRef = React.createRef();
      
    }

    

    /**** function defination for submit clients ****/
    handleUpdateClient = () =>{
        let isAbleForSubmission = false;

        if( 
            this.state.clientName != '' && this.state.clientEmail!='' && this.clientPassword !=''
        ){
            isAbleForSubmission = true
        }

        if(isAbleForSubmission == true){
            if(this.state.assignedFolder.length == 0){
                showConfirm('Are You Sure?','No file assigned','warning',() => {
                    this.updateClient()
                })
            }else{
                 this.updateClient();
            }
        }else{
            showToast('error','Please provide valid information before adding client')
        }

      
    }


    /*** FUNCTION DEFINATION TO GET SELECTED CLIENT DETAILS ***/
    getSelectedClientDetails = (param) => {
        //console.log(this.props.globalState.clientListReducer.clientsList)
        var clientsList = this.props.globalState.clientListReducer.clientsList
        console.log(clientsList)
        if(clientsList != undefined && clientsList.length != 0){
            console.log(clientsList.length)
            for(let i=0;i<clientsList.length;i++){
                console.log(clientsList[i].user_id+'  ____ '+param)
                if(clientsList[i].user_id === param){
                    console.log(clientsList[i])
                    this.setState({showLoader : true})
                    setTimeout(() => {
                        
                        this.setState({
                            clientName : clientsList[i].user_name,
                            clientEmail : clientsList[i].user_email,
                            clientPassword : clientsList[i].user_password,
                            clientCompany : clientsList[i].user_company,
                            hasPermissionToChangePassword:clientsList[i].change_password,
                            hasPermissionToAccessPersonalSettings:clientsList[i].access_user_settings,
                            showLoader : false,
                            userCreatedBy : clientsList[i].created_by
                        })
                        
                    }, 5000);
                    break;
                }
            }
        }else{
            
            showToast('error','Rendering error please go back to browse clients')
        }
    }

    /*** FUNCTION DEFINATION TO UPDATE CLIENT ***/
    updateClient = () => {
        var payload = {
            
        "user_id": this.state.clientId,
        "user_name": this.state.clientName,
        "user_email": this.state.clientEmail,
        "user_password": this.state.clientPassword,
        "user_company":this.state.clientCompany,
        "user_type": this.state.userType,
        "user_role":this.state.userRole,
        "created_by":this.state.userCreatedBy,
        "user_status": 2,
        "access_user_settings":this.state.hasPermissionToAccessPersonalSettings,
        "change_password":this.state.hasPermissionToChangePassword
        } 
        this.setState({showLoader : true})
        UpdateUser(payload).then(function(res){
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                this.setState({showLoader : false})
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                showToast('success','Client updated successfully');
                document.getElementById('backBtn').click();
                if(this.state.assignedFolder.length != 0){
                    for(let i=0;i<this.state.assignedFolder.length;i++){
                        let iter = this.state.assignedFolder[i]
                       // for(let j=0;j<insertedUserId.length;j++){

                            this.assignUserToEntity(this.state.clientId,iter)
                        //}
                    }
                }
            }
         }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
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
     /*** FUNCTION DEFINATION FOR CLOSING ASSIGN FOLDER MODAL ***/
     handleApplyAssignedUser = () => {
        this.setState({showAssignFolderModal : false,folderListWithSearchQuery : []})
        console.log(this.state.assignedUser)
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
        console.log(param)
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
                                            <div className="lft-hdr">
                                                <span><i className="fas fa-user-plus"></i></span>Edit Client
                                            </div>
                                            <div className="rght-hdr ">
                                                <Link to="/browse-clients" className="addclient" type="button"> <i className="fas fa-arrow-left" id="backBtn"></i> Back</Link>
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
                                                                        defaultValue={this.state.clientName} onBlur={(event) => {this.setState({clientName : event.target.value})}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Email</label>
                                                                        <input type="text" className="form-control" placeholder="Email" 
                                                                        defaultValue={this.state.clientEmail} onBlur={(event) => {this.setState({clientEmail : event.target.value})}} readOnly/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Company(optional)</label>
                                                                        <input type="text" className="form-control" placeholder="Company"
                                                                       defaultValue={this.state.clientCompany} onBlur={(event) => {this.setState({clientCompany : event.target.value})}}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Password</label>
                                                                        <input type="text" className="form-control" placeholder="Password" 
                                                                        defaultValue={this.state.clientPassword} onBlur={(event) => {this.setState({clientPassword : event.target.value})}}/>
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
                                                            <input type="checkbox" className="custom-control-input" id="customCheck1" checked={this.state.hasPermissionToChangePassword} onClick={()=>{this.setState({hasPermissionToChangePassword : !this.state.hasPermissionToChangePassword})}}/>
                                                            <label className="custom-control-label" htmlFor="customCheck1">Change Their Password</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck2" checked={this.state.hasPermissionToAccessPersonalSettings} onClick={()=>{this.setState({hasPermissionToAccessPersonalSettings : !this.state.hasPermissionToAccessPersonalSettings})}}/>
                                                            <label className="custom-control-label" htmlFor="customCheck2">Access Personal Settings</label>
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
                                        </div>
                                        <div className="modal_button_area">
                                            <button type="button" className="submit" onClick={this.handleUpdateClient}>Update</button>
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

        /*** SETTING CLIENT'S ID FROM LOCALSTORAGE TO STATE ***/
        let currentPage = localStorage.getItem(SITENAMEALIAS + '_current_page');
        let currentPageArr = currentPage.split('/')
        if(currentPageArr[2] != undefined && currentPageArr[2] != null && currentPageArr[2] != ''){
            this.setState({clientId : currentPageArr[2]});
            setTimeout(() => {
                this.getSelectedClientDetails(this.state.clientId)
            }, 1000);
        }else{
            showToast('error',"Client's id missing");
            this.props.history.push('/browse-clients')
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

export default connect(mapStateToProps,mapDispatchToProps)(UpdateClient)

