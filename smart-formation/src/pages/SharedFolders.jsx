import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast,showConfirm,showHttpError,manipulateFavoriteEntity,isEntityExist } from '../utils/library'
import {CreateDirectory,GetAllSubDirectory,addDirectoryAssignedUser,removeDirectory,GetDirectory,RenameFolder,GetUserDetails,GetAllUser} from '../utils/service'
import { connect } from 'react-redux';
import Moment from 'react-moment';
import {setSharedFoldersList} from '../utils/redux/action'
import { Link,withRouter,browserHistory,matchPath, Redirect  } from 'react-router-dom';

 class SharedFolders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            showCreateFolderModal : false,
            showCreateFolderDropDown : false,
            createdBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            loggedInUserRole: JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role,
            addPeopleToFolder : false,
            totalCharacterForFolderDetails : 1000,
            foldersList : [],
            showAssignUserModal : false,
            userListWithSearchQuery: [],
            assignedUser :[],
            searchQuery : '',
            selectedEntityInfo: {},
            selectedFolderAssignedTo : [],
            page: 0,
            noOfItemsPerPage: 50,
            totalCount: 0,
            sort: -1,
            totalPageToRender: 10,
            pageRenderingStartsAt: 0,
            pageButtonArr: [],
            paginationType: 'increase'

            
        };
         /***  BINDING FUNCTIONS  ***/
        this.openCreateFolderModal = this.openCreateFolderModal.bind(this)
        this.closeCreateFolderModal = this.closeCreateFolderModal.bind(this)
        this.openAssignUserModal = this.openAssignUserModal.bind(this)
        this.closeAssignUserModal = this.closeAssignUserModal.bind(this)
        this.handleAddPeople = this.handleAddPeople.bind(this)
        this.handleSubmitForCreateFolder = this.handleSubmitForCreateFolder.bind(this)
        this.fetchAllParentDirectory = this.fetchAllParentDirectory.bind(this)
        this.getEntityOwnerDetails = this.getEntityOwnerDetails.bind(this)
        this.handleFolderDetails = this.handleFolderDetails.bind(this)
        this.isUserAlreadyAssigned = this.isUserAlreadyAssigned.bind(this)
        this.handleSelectUser  = this.handleSelectUser.bind(this)
        this.assignUserToEntity = this.assignUserToEntity.bind(this)
        this.searchEntity = this.searchEntity.bind(this)
        this.handleDeleteEntity = this.handleDeleteEntity.bind(this)

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.folderNameRef = React.createRef();
        this.folderNameForUpdateRef = React.createRef();
        this.folderDetailsRef = React.createRef();
      
    }

    

    /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
    openCreateFolderModal = () => {
       this.setState({showCreateFolderModal : true})
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
    closeCreateFolderModal = () => {
        this.setState({showCreateFolderModal : false,showCreateFolderDropDown:false, assignedUser :[],userListWithSearchQuery : []})
    }
    /*** FUNCTION DEFINATION TO HANDLE DELETE ENTITY ***/
    handleDeleteEntity = (param) => {
        showConfirm('Delete', 'Are you sure want to delete?', 'warning', () => {
            let payload = { entity_id: param }
            removeDirectory(payload).then(function (res) {
                var response = res.data;
                if (response.errorResponse.errorStatusCode != 1000) {
                    this.setState({ showLoader: false })
                    showToast('error', response.errorResponse.errorStatusType);
                } else {

                    showToast('success', 'Document Deleted Successfully');
                    this.fetchAllParentDirectory();
                }
            }.bind(this)).catch(function (err) {
                this.setState({ showLoader: false })
                showHttpError(err,this.props)
            }.bind(this))
        })
    }

   /*** FUNCTION DEFINATION FOR HANDLING RADIO FOR ADD/ASSIGN PEOPLE TO FOLDER***/
   handleAddPeople = (e) => {
       console.log(e.target.value)
    let assignPeopleBool = false
    if(e.target.value == 'true'){
        assignPeopleBool = true
        this.openAssignUserModal();
    }
    this.setState({addPeopleToFolder : assignPeopleBool})
   }

   /*** FUNCTION DEFINATION FOR OPENING USER MODAL ***/
   openAssignUserModal = () => {
    this.setState({showAssignUserModal : true})
 }

 /*** FUNCTION DEFINATION FOR CLOSING USER MODAL ***/
 closeAssignUserModal = () => {
     this.setState({showAssignUserModal : false,userListWithSearchQuery : []})
 }
  /*** FUNCTION DEFINATION FOR OPENING ENTITY INFO MODAL ***/
  openEntityInfoModal = () => {
    this.setState({ showEntityInfoModal: true })
}
/*** FUNCTION DEFINATION FOR CLOSING ENTITY INFO MODAL ***/
closeEntityInfoModal = () => {
    this.setState({ showEntityInfoModal: false, selectedEntityInfo: {} ,selectedFolderAssignedTo : []})
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
                    this.setState({showCreateFolderModal : false,showCreateFolderDropDown:false,addPeopleToFolder:false,userListWithSearchQuery : []})
                    var insertedEntityId = response.lastRecordId
                    console.log(insertedEntityId)
                    if(this.state.assignedUser.length != 0){
                        for(let i=0;i<this.state.assignedUser.length;i++){
                            let iter = this.state.assignedUser[i]
                            this.assignUserToEntity(iter,insertedEntityId)
                        }
                    }
                    this.fetchAllParentDirectory()
                    
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err,this.props)
            }.bind(this))
        }else{
            showToast('error','Please provide valid information')
        }
   }
    

   /*** FUNCTION DEFINATION TO GET ALL PARENT DIRECTORY AS PER AS USER TYPE ***/
   fetchAllParentDirectory = () => {
    let payload = {};
    if(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role == 'ADMIN'){
     payload = {entity_id : '',page : this.state.page,limit:this.state.noOfItemsPerPage,sort:this.state.sort,searchQuery:this.state.searchQuery,asigned_user_id:''}
    }else{
     payload = {entity_id : '',page : this.state.page,limit:this.state.noOfItemsPerPage,sort:this.state.sort,searchQuery:this.state.searchQuery,asigned_user_id:this.state.createdBy}
    }
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
                        arr.push(folders[i]);
                        /* if(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role == 'ADMIN'){
                            console.log(folders[i].shared_user_ids.length)
                            if(folders[i].shared_user_ids.length !=0 || folders[i].asigned_user_ids.length != 0){
                                 if(this.state.searchQuery != ''){
                                    console.log(folders[i].entity_name)
                                    console.log(this.state.searchQuery)
                                    if(folders[i].entity_name.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1){
    
                                        arr.push(folders[i]);
                                    }
                                }else{ 
                                    arr.push(folders[i]);
                                //}
                            }
                        }else{
                            //console.log(folders[i])
                            let userIds = folders[i].asigned_user_ids
                            console.log(userIds)
                            console.log(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id)
                            for(let j=0;j<userIds.length;j++){
                                //console.log(userIds[j],JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id)
                                if(userIds[j] == JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id){
                                    console.log('here')
                                    if(this.state.searchQuery != ''){
                                        if(folders[i].entity_name.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1){
        
                                            arr.push(folders[i]);
                                        }
                                    }else{
                                        arr.push(folders[i]);
                                    }
                                    console.log('******');
                                    console.log(arr);
                                }
                            }
                        } */
                    }
                    let lengthOfFolders = 0;
                    console.log(arr.length,this.state.noOfItemsPerPage)
                    if(arr.length < this.state.noOfItemsPerPage){
                        lengthOfFolders = arr.length;
                    }else{
                        lengthOfFolders = response.totalCount;
                    }
                    console.log('lengthOfFolders',lengthOfFolders)
                    this.setState({foldersList : arr,totalCount : lengthOfFolders })
                    this.props.setSharedFoldersList(this.state.foldersList);
                   // console.log(this.state.foldersList)
                //console.log(this.props.globalState)
                this.handlePaginationLogic();
                    
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err,this.props)
            }.bind(this))
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

    /*** function defination to handle folder details ***/
   handleFolderDetails = (param) => {
    this.props.history.push('/folder-details/'+param+'/shared_folder')
    }  

    /*** FUNCTION DEFINATION TO CHECK IF A FOLDER IS ALREADY ASSIGNED ****/
    isUserAlreadyAssigned = (param) => {
        if(this.state.assignedUser.includes(param)){
            return true
        }else{
            return false
        }
    }
    /*** FUNCTION DEFINATION TO ASSiGN User to folder ****/
    handleSelectUser = (param) => {
        let arr = this.state.assignedUser
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
        this.setState({assignedUser : arr})
        console.log(this.state.assignedUser)
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
            console.log(payload)
            addDirectoryAssignedUser(payload).then(function(res){
                var response = res.data;
                if(response.errorResponse.errorStatusCode != 1000){
                    this.setState({showLoader : false})
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    
                    setTimeout(() => {
                        this.setState({
                        
                            assignedUser : [],
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

        /*** FUNCTION DEFINATION TO MATCH FOLDER NAME WITH GIVEN INPUT ***/
        isUserMatched = (param) => {
            let arr = []
            if (param != '') {
                this.setState({ showLoader: true })
                let payload = {
                    page_no: 1,
                    page_size: 50,
                    searchQuery : param
                }
                GetAllUser(payload).then(function (res) {
                    var response = res.data;
                    if (response.errorResponse.errorStatusCode != 1000) {
                        this.setState({ showLoader: false })
                        showToast('error', response.errorResponse.errorStatusType);
                    } else {
                        this.setState({ showLoader: false })
                        if(response.response != undefined){
    
                            this.setState({ userListWithSearchQuery: response.response })
                        }else{
                            this.setState({ userListWithSearchQuery: [] })
                        }
                    }
                }.bind(this)).catch(function (err) {
                    this.setState({ showLoader: false })
                    showHttpError(err,this.props)
                }.bind(this))
            } else {
            }
           
            //console.log(this.state.userListWithSearchQuery)
        }

         /*** FUNTION DEFINATION FOR search ENTITY NAME ***/
         searchEntity = (param) => {
            this.setState({searchQuery :param},()=>{
                this.fetchAllParentDirectory();
            })
        }
         /***  Function defination for handling file folder information ****/
         getFileFolderInfo = (param) => {
            console.log(param);
            /* Entity Size */
            let id = param.entity_id
            let name = param.entity_name
            let location = param.entity_location
            this.showLoader = true;
            let payload = { directoryName: id }
            GetDirectory(payload).then(function (res) {
                let response = res.data.response;
                if (response !== null) {
                    let size = response.folderSize;
                    this.setState({ showLoader: false, selectedEntityInfo: { size: size, name: name, id: id } }, () => {
                        this.openEntityInfoModal();
                    });
                }else{
                    let size = '';
                    this.setState({ showLoader: false, selectedEntityInfo: { size: size, name: name, id: id } }, () => {
                        this.openEntityInfoModal();
                    });
                }
            }.bind(this)).catch(function (err) {
                this.setState({ showLoader: false })
                showHttpError(err,this.props)
            }.bind(this))
    
            /* Entity Assignee */
            let nameArr = [];
            if (param.asigned_user_ids.length !== 0 ) {
                for (let i = 0; i < param.asigned_user_ids.length; i++) {
                    let id = param.asigned_user_ids[i];
                    this.setState({ showLoader: true });
                    let payload = {
                        user_id :id
                    }
                    GetUserDetails(payload).then(function (res) {
                        let response = res.data;
                        if(response.errorResponse.errorStatusCode != 1000){
                            showToast('error',response.errorResponse.errorStatusType);
                        }else{
                            nameArr = this.state.selectedFolderAssignedTo
                            nameArr.push(response.response.user_name);
                            this.setState({ selectedFolderAssignedTo: nameArr });
                        }
                    }.bind(this)).catch(function (err) {
                        this.setState({ showLoader: false })
                        showHttpError(err,this.props)
                    }.bind(this))
            
                }
            }
    
        }
    /*** Method defination for handling folder sorting ***/
    handleFolderSorting = (param) => {
        this.setState({sort : param},()=>{
            this.fetchAllParentDirectory();
        })
    }

    /* method defination for handling pagination logic */
    handlePaginationLogic = () => {
        console.log("Page : ",this.state.page+1)
        /* logic for pagination page button rendering */
        // let totalPageToRender = Math.ceil(this.state.totalCount/this.state.noOfItemsPerPage)
        
        let start = this.state.pageRenderingStartsAt
        let end = start + this.state.totalPageToRender
        console.log(start,end)
        console.log(this.state.page + 1,end)
        if (parseInt(this.state.page + 1) >= parseInt(end)) {
            if(this.state.paginationType == 'increase'){
                start = start + this.state.totalPageToRender-1;
                end = end + this.state.totalPageToRender
            }else{
                start = start - this.state.totalPageToRender-1;
                end = end - this.state.totalPageToRender+1
            }
        }else{
            if(this.state.page<this.state.totalPageToRender){
                start = 0;
                end = 10;
            }else{
                start = this.state.page-this.state.totalPageToRender/2;
                end = this.state.page + this.state.totalPageToRender/2;
            }
        }
                  
        console.log(start,end)
        let pageButtonArr = [];
        if(end > Math.ceil(this.state.totalCount / this.state.noOfItemsPerPage)){
            end = Math.ceil(this.state.totalCount / this.state.noOfItemsPerPage)
        }
        for (let i = start; i < end; i++) {
            pageButtonArr.push(i)
        }
        this.setState({
            pageButtonArr: pageButtonArr,
            pageRenderingStartsAt: start
        }, () => {
            //console.log(this.state.totalPageToRender,this.state.page)
        })
    }

    /* method for handling folder name chnage */
    handleUpdateFolderName = () => {
        let payload = {
            entity_id : this.state.selectedEntityInfo.id,
            entity_name : this.folderNameForUpdateRef.current.value,
        }
        RenameFolder(payload).then(function (res) {
            let response = res.data.response;
            if (response !== null) {
                this.fetchAllParentDirectory();
                this.closeEntityInfoModal();
            }
        }.bind(this)).catch(function (err) {
            this.setState({ showLoader: false })
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
                                        <div className="head-job">
                                            <div className="lft-hdr"><span><i className="fas fa-folder-open"></i></span>Shared Folders</div>
                                           
                                                    <div className="lft-hdr">
                                                    <label>Sort : </label>
                                                        <select className="form-control" onChange={(e)=>{this.handleFolderSorting(e.target.value)}}>
                                                            <option value="-1">Decending Order </option>
                                                            <option value="1">Ascending Order</option>
                                                        </select>
                                                    </div>
                                                    
                                                    <div className="lft-hdr">
                                                    <label>Search : </label>
                                                <input type="text" className="form-control" placeholder="Search folder" onKeyUp={(e)=>{this.searchEntity(e.target.value)}}/>
                                            </div>
                                             {JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role === 'ADMIN' && <div className="addbutton">
                                                <span className={this.state.showCreateFolderDropDown ? "addbutton_click cross" : "addbutton_click"} onClick={()=>{this.setState({showCreateFolderDropDown : !this.state.showCreateFolderDropDown})}}><i className="fas fa-plus"></i></span>
                                                <div className={this.state.showCreateFolderDropDown ? "drop_menu view_drop" : "drop_menu"}>
                                                <button type="button" data-toggle="modal" data-target="#creatfolderModal" onClick={this.openCreateFolderModal}><i className="fas fa-folder-open"></i>Create Folder</button>
                                                </div>
                                            </div>} 
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_sharedfolders">
                                        <div className="dash_lft_t" style={{overflowX:"auto"}}>
                                            <table className="table_all table dt-responsive nowrap">
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    {/* <th>Size</th> */}
                                                    <th>Uploaded</th>
                                                    <th>Details</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.foldersList.map((list) =>
                                                <tr className="" key={list.entity_id}>
                                                    <td><span className="select" onClick={()=>{manipulateFavoriteEntity(this.state.createdBy,[list.entity_id],() => {this.fetchAllParentDirectory()})}}><i className="far fa-star"></i></span><span className="foldericon"><i className={list.is_directory ? "fas fa-folder-open" : "fas fa-file-pdf"}></i></span><a href="#!">{list.entity_name}</a><span className="ml-2" onClick={() => { this.getFileFolderInfo(list) }}><i className="fas fa-info-circle"></i></span></td>
                                                    
                                                    <td>
                                                        <Moment format="YYYY/MM/DD HH:mm:ss" date={list.entity_created}/>
                                                    </td>
                                                   
                                                    <td>
                                                        {list.is_directory ? <button className="btn btn-primary"  onClick={()=>{this.handleFolderDetails(list.entity_id)}}> <i className="fas fa-eye"></i>  Details</button> : <a href={list.entity_location} className="btn btn-warning"> <i className="fas fa-eye"></i> Show</a>} 
                                                        {this.state.loggedInUserRole === 'ADMIN' ? <a href="javascript:void(0)" className="ml-2 btn btn-danger" onClick={() => { this.handleDeleteEntity(list.entity_id) }}> <i className="fas fa-trash-alt" ></i>Delete</a> : ''}
                                                        </td>
                                                </tr>)}
                                                
                                                </tbody>
                                            </table>
                                            {this.state.foldersList.length > this.state.noOfItemsPerPage/2 && <nav aria-label="Page navigation example">
                                                        <ul className="pagination justify-content-center">
                                                            {this.state.page > 0 && <li className="page-item">
                                                                <a className="page-link" href="javascript:void(0)" tabindex="-1" onClick={(e) => {
                                                                    this.setState({
                                                                        page: this.state.page - 1,
                                                                        paginationType : 'decrease'
                                                                    }, () => {
                                                                        this.fetchAllParentDirectory();
                                                                    })
                                                                }}>Previous</a>
                                                            </li>}
                                                            {this.state.pageButtonArr.map((pagi) => <li className={this.state.page === pagi ?"page-item active":"page-item"} key={pagi}><a className="page-link" href="javascript:void(0)" onClick={(e) => {
                                                                this.setState({ page: pagi,paginationType:'increase' }, () => {
                                                                    this.fetchAllParentDirectory();
                                                                })
                                                            }}>{pagi + 1}</a></li>)}
                                                            {Math.ceil(this.state.totalCount / this.state.noOfItemsPerPage) > this.state.page + 1 && <li className="page-item">
                                                                <a className="page-link" href="javascript:void(0)" onClick={(e) => {
                                                                    this.setState({
                                                                        page: this.state.page + 1,
                                                                        paginationType : 'increase'
                                                                    }, () => {
                                                                        this.fetchAllParentDirectory();
                                                                    })
                                                                }}>Next</a>
                                                            </li>}
                                                        </ul>
                                                    </nav>}
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
                            <span className="text-danger mt-2">* You must use select yes to assign user or your folder will be treated as personal folder </span>
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
                        show={this.state.showAssignUserModal}
                        onHide={this.closeAssignUserModal}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                        <Modal.Title>Assign People</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="importmodal_content">
                        <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Search People" onKeyUp={(event)=>{this.isUserMatched(event.target.value)}}/>
                       {/*  <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button">Search</button>
                        </div> */}
                        </div>
                            <ul className="">
                              {this.state.userListWithSearchQuery.map((list) =>
                                <li className="list-group-item" key={list.user_id}>
                                  <div className="row">
                                      <div className="col-md-2">
                                          <input type="checkbox" checked={this.isUserAlreadyAssigned(list.user_id) ? 'checked' : ''} onClick={()=>{this.handleSelectUser(list.user_id)}}/>
                                      </div>
                              <div className="col-md-8">{list.user_name}({list.user_email})</div>
                                  </div>
                              </li> )}
                            </ul>   
                            <button type="button" className="btn btn-primary" onClick={this.closeAssignUserModal}>Assign </button> 
                        </div>
                        </Modal.Body>
                        
                    </Modal>
                    <Modal
                    show={this.state.showEntityInfoModal}
                    onHide={this.closeEntityInfoModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.selectedEntityInfo.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="importmodal_content">
                            <span>Size : {parseInt(this.state.selectedEntityInfo.size)/1000} KB</span>
                            <span>Assigned To :  {this.state.selectedFolderAssignedTo.map((name) =><p style={{whiteSpace: "pre-line"}} key={name}>{name}</p>)}</span>
                        </div>
                        <div className="importmodal_content">
                            <h4>  Rename Folder </h4>
                            <form className="form-inline" >
                                <div className="form-group mb-2">
                                
                                    <input type="text" readonly className="form-control mr-2" defaultValue={this.state.selectedEntityInfo.name}  ref={this.folderNameForUpdateRef}/>
                                </div>

                                <button type="button" className="btn btn-primary mb-2" onClick={this.handleUpdateFolderName}>Save</button>
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
       /*** Get all parent folder's ***/ 
       this.fetchAllParentDirectory();
   }
   
    
}
const mapStateToProps = state => {
    return {
        globalState : state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSharedFoldersList : (array) => dispatch(setSharedFoldersList(array)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(SharedFolders))

