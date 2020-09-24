import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import {CreateDirectory,GetAllSubDirectory,CreateFile} from '../utils/service'
import { connect } from 'react-redux';
import Moment from 'react-moment';
import {setPersonalFoldersList} from '../utils/redux/action'
import { Link,withRouter,browserHistory,matchPath, Redirect  } from 'react-router-dom';

 class FolderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            showCreateFolderModal : false,
            showUploadFileModal : false,
            showCreateFolderDropDown : false,
            createdBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            addPeopleToFolder : false,
            addPeopleToFile : false,
            totalCharacterForFolderDetails : 1000,
            foldersList : [],
            parentFolderId :'',
            fromPage : '',
            parentFolderName : ''

            
        };
         /***  BINDING FUNCTIONS  ***/
        this.openCreateFolderModal = this.openCreateFolderModal.bind(this)
        this.openUploadFileModal = this.openUploadFileModal.bind(this)
        this.closeCreateFolderModal = this.closeCreateFolderModal.bind(this)
        this.closeUploadFileModal = this.closeUploadFileModal.bind(this)
        this.handleAddPeople = this.handleAddPeople.bind(this)
        this.handleSubmitForCreateFolder = this.handleSubmitForCreateFolder.bind(this)
        this.handleSubmitForUploadFile = this.handleSubmitForUploadFile.bind(this)
        this.getEntityOwnerDetails = this.getEntityOwnerDetails.bind(this)
        this.getFolderDetails = this.getFolderDetails.bind(this)
        this.fetchAllParentDirectory = this.fetchAllParentDirectory.bind(this)

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.folderNameRef = React.createRef();
        this.folderDetailsRef = React.createRef();
        this.fileRef = React.createRef();
      
    }

    

    /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
    openCreateFolderModal = () => {
       this.setState({showCreateFolderModal : true})
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
    closeCreateFolderModal = () => {
        this.setState({showCreateFolderModal : false,showCreateFolderDropDown:false})
    }
    /*** FUNCTION DEFINATION FOR OPENING UPLOAD FILE MODAL ***/
    openUploadFileModal = () => {
       this.setState({showUploadFileModal : true})
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD FILE MODAL ***/
    closeUploadFileModal = () => {
        this.setState({showUploadFileModal : false,showCreateFolderDropDown:false})
    }

   /*** FUNCTION DEFINATION FOR HANDLING RADIO FOR ADD/ASSIGN PEOPLE TO FOLDER***/
   handleAddPeople = (e) => {
    let assignPeopleBool = false
    if(e.target.value == 'true'){
        assignPeopleBool = true
    }
    this.setState({addPeopleToFolder : assignPeopleBool})
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
                    "parent_directory_id": this.state.parentFolderId,
                    "directory_owner": this.state.createdBy
            
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
                    this.setState({showCreateFolderModal : false,showCreateFolderDropDown:false,addPeopleToFolder:false})
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
    

   


    /*** FUNCTION DEFINATION TO GET FOLDER OR FILE OWNER DETAILS ****/
    getEntityOwnerDetails = (param) =>{
        let clients = this.props.globalState.clientListReducer.clientsList
        let employees = this.props.globalState.employeeListReducer.employeesList

        var ownerObj = {};

        if(clients != undefined ){
            for(let i=0;i<clients.length;i++){
            if(param == clients[i].user_id){
                ownerObj = {
                ownerId : clients[i].user_id,
                ownerName : clients[i].user_name,
                ownerRole : clients[i].user_role,
                ownerCompany : clients[i].user_company,
                ownerEmail : clients[i].user_email,
                }
                break;
            }
            }
        }else{
            this.props.history.push('/dashboard')
        }
      
        if(employees!= undefined){
            for(let i=0;i<employees.length;i++){
            if(param == employees[i].user_id){
                ownerObj = {
                ownerId : employees[i].user_id,
                ownerName : employees[i].user_name,
                ownerRole : employees[i].user_role,
                ownerCompany : employees[i].user_company,
                ownerEmail : employees[i].user_email,
                }
                break;
            }
            }
        }else{
            this.props.history.push('/dashboard')
        }
      
        return ownerObj;
      
      }


      /*** FUNCTION DEFINATION FOR GETTING FOLDER DETAILS ***/
      getFolderDetails = (parentFolderId,fromPage) =>{

          var foldername = ''
        if(fromPage.indexOf('personal') != -1){
            var parentPage = 'Personal Folders';
            var fallBackRoute = '/personal-folders'
            var folders = this.props.globalState.personalFoldersReducer.list;
        }else if(fromPage.indexOf('shared') != -1){
            var parentPage = 'Shared Folders';
            var fallBackRoute = '/shared-folders'
            var folders = this.props.globalState.sharedFoldersReducer.list;
        }else{
            var parentPage = 'Favorite Folders';
            var fallBackRoute = '/favorite-folders'
            var folders = this.props.globalState.favoriteFoldersReducer.list;
        }

        if(folders != undefined){
            for(let i=0;i<folders.length;i++){
                if(parentFolderId == folders[i].entity_id){
                    foldername = folders[i].entity_name
                    break;
                }
            }
            this.fetchAllParentDirectory()
        }else{
            this.props.history.push(fallBackRoute)
        }

        this.setState({
            parentFolderName : foldername,
            fromPage : parentPage,
        })

      }


      /*** FUNCTION DEFINATION FOR UPLOADING FILE ***/
      handleSubmitForUploadFile = (e) =>{
        e.preventDefault();
        let file = document.getElementById('uploadFile');
       let type = (file.files[0].name.split('.'))[1];
       if(type == 'pdf' ){

           let fd = new FormData();
           fd.append('file',file.files[0])
           fd.append('parent_directory_id',this.state.parentFolderId)
           fd.append('directory_owner',this.state.createdBy)
           fd.append('file_type','FILE')

           this.setState({showLoader : true})
           CreateFile(fd).then(function(res){
                var response = res.data;
                this.setState({showLoader : false})
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    showToast('success','Folder created successfully');
                    this.setState({showUploadFileModal: false,showCreateFolderDropDown:false,addPeopleToFolder:false})
                    this.fetchAllParentDirectory()
                    
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err)
            }.bind(this))

       }else{
            showToast('error','Please provide pdf files only')
       }

      }



         /*** FUNCTION DEFINATION TO GET ALL PARENT DIRECTORY AS PER AS USER TYPE ***/
   fetchAllParentDirectory = () => {
    let payload = {entity_id : this.state.parentFolderId}
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
                        if(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role == 'ADMIN'){
                            arr.push(folders[i]);
                        }else{
                            if(folders[i].directory_owner == JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id){
                                arr.push(folders[i]);
                            }
                        }
                    }
                    this.setState({foldersList : arr})
                    this.props.setPersonalFoldersList(this.state.foldersList);
                    console.log(this.state.foldersList)
                    console.log(this.props.globalState)
                    
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err)
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
        <div className="lft-hdr"><span><i className="fas fa-folder-open"></i></span>{this.state.fromPage} <i class="fas fa-arrow-right"></i>  {this.state.parentFolderName}</div>
                                            <div className="addbutton">
                                                <span className={this.state.showCreateFolderDropDown ? "addbutton_click cross" : "addbutton_click"} onClick={()=>{this.setState({showCreateFolderDropDown : !this.state.showCreateFolderDropDown})}}><i className="fas fa-plus"></i></span>
                                                <div className={this.state.showCreateFolderDropDown ? "drop_menu view_drop" : "drop_menu"}>
                                                <button type="button" data-toggle="modal" data-target="#creatfolderModal" onClick={this.openCreateFolderModal}><i className="fas fa-folder-open"></i>Create Folder</button>
                                                <button type="button"  onClick={this.openUploadFileModal}><i className="fas fa-file-pdf"></i>Upload File</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_sharedfolders">
                                        <div className="dash_lft_t">
                                            <table className="table_all table dt-responsive nowrap">
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    {/* <th>Size</th> */}
                                                    <th>Uploaded</th>
                                                    <th>Create</th>
                                                </tr>
                                                </thead>
                                                {this.state.foldersList.length != 0 ? <tbody>
                                                {this.state.foldersList.map((list) =>
                                                <tr className="pointer-cursor" key={list.entity_id}>
                                                    <td><span className="select"><i className="far fa-star"></i></span><span className="foldericon"><i className={list.is_directory ? "fas fa-folder-open" : "fas fa-file-pdf"}></i></span><a href="#!">{list.entity_name}</a></td>
                                                    
                                                    <td>
                                                        <Moment format="YYYY/MM/DD" date={list.user_created}/>
                                                    </td>
                                                    <td>{this.getEntityOwnerDetails(list.directory_owner).ownerName}</td>
                                                </tr>)}
                                                
                                                </tbody> : <tbody><tr><td className="text-center" colSpan="3">Folder is Empty </td></tr></tbody>}
                                            </table>
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
                           <label>Add People To Folder</label>
                           <div>
                              <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="AddPeople" value="true" checked ={this.state.addPeopleToFolder == true} onClick={(event) => {this.handleAddPeople(event)}}/>
                                 <label className="form-check-label">Yes</label>
                              </div>
                              <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="AddPeople" value="false" checked ={this.state.addPeopleToFolder == false} onClick={(event) => {this.handleAddPeople(event)}}/>
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


                    <Modal
                        show={this.state.showUploadFileModal}
                        onHide={this.closeUploadFileModal}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Upload File</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="modal_cera_folder_area">
                     <form onSubmit = {this.handleSubmitForUploadFile}>
                        <div className="form-group">
                           <label>Name</label>
                           <input type="file" className="form-control" placeholder="Name" id="uploadFile" ref={this.fileRef} />
                        </div>
                        
                        <div className="form-group">
                           <label>Add People To Folder</label>
                           <div>
                              <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="AddPeople" value="true" checked ={this.state.addPeopleToFile == true} onClick={(event) => {this.handleAddPeople(event)}}/>
                                 <label className="form-check-label">Yes</label>
                              </div>
                              <div className="form-check form-check-inline">
                                 <input className="form-check-input" type="radio" name="AddPeople" value="false" checked ={this.state.addPeopleToFile == false} onClick={(event) => {this.handleAddPeople(event)}}/>
                                 <label className="form-check-label">No</label>
                              </div>
                           </div>
                        </div>
                        
                        <div className="modal_button_area">
                           <button type="submit" className="submit">Upload File</button>
                           <button type="button" className="cancle" data-dismiss="modal" aria-label="Close" onClick={this.closeUploadFileModal}>Cancel</button>
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
       
        /*** FOLDER DETIALS LIST ***/
        const match = matchPath(this.props.history.location.pathname, {
            path: '/folder-details/:param1/:param2',
            exact: true,
            strict: false
          })
        console.log(match.params)
        this.state.parentFolderId = match.params.param1
        this.getFolderDetails(match.params.param1,match.params.param2)  

       
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

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(FolderDetails))

