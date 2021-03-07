import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS, FILEPATH } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast, showConfirm, showHttpError, manipulateFavoriteEntity, isEntityExist } from '../utils/library'
import { CreateDirectory, GetAllSubDirectory, CreateFile, addDirectoryAssignedUser, removeDirectory } from '../utils/service'
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { setPersonalFoldersList } from '../utils/redux/action'
import { Link, withRouter, browserHistory, matchPath, Redirect } from 'react-router-dom';

class FolderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            showCreateFolderModal: false,
            showUploadFileModal: false,
            showCreateFolderDropDown: false,
            createdBy: JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            loggedInUserRole: JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role,
            addPeopleToFolder: false,
            addPeopleToFile: false,
            totalCharacterForFolderDetails: 1000,
            foldersList: [],
            parentFolderId: '',
            fromPage: '',
            parentFolderName: '',
            showAssignUserModal: false,
            userListWithSearchQuery: [],
            assignedUser: [],
            selectedEntityArray: [],


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
        this.isUserAlreadyAssigned = this.isUserAlreadyAssigned.bind(this)
        this.handleSelectUser = this.handleSelectUser.bind(this)
        this.handleFolderDetails = this.handleFolderDetails.bind(this)
        this.assignUserToEntity = this.assignUserToEntity.bind(this)
        this.handleDeleteEntity = this.handleDeleteEntity.bind(this)


        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.folderNameRef = React.createRef();
        this.folderDetailsRef = React.createRef();
        this.fileRef = React.createRef();

    }



    /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
    openCreateFolderModal = () => {
        this.setState({ showCreateFolderModal: true, addPeopleToFolder: false })
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
    closeCreateFolderModal = () => {
        this.setState({ showCreateFolderModal: false, showCreateFolderDropDown: false, userListWithSearchQuery: [], addPeopleToFolder: false, assignedUser: [] })
    }
    /*** FUNCTION DEFINATION FOR OPENING UPLOAD FILE MODAL ***/
    openUploadFileModal = () => {
        this.setState({ showUploadFileModal: true, addPeopleToFile: false })
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD FILE MODAL ***/
    closeUploadFileModal = () => {
        this.setState({ showUploadFileModal: false, showCreateFolderDropDown: false, userListWithSearchQuery: [], addPeopleToFile: false, assignedUser: [] })
    }
    /*** FUNCTION DEFINATION FOR OPENING USER MODAL ***/
    openAssignUserModal = () => {
        this.setState({ showAssignUserModal: true })
    }
    /*** FUNCTION DEFINATION FOR CLOSING USER MODAL ***/
    closeAssignUserModal = () => {
        this.setState({ showAssignUserModal: false, userListWithSearchQuery: [] })
    }

    /*** FUNCTION DEFINATION FOR HANDLING RADIO FOR ADD/ASSIGN PEOPLE TO FOLDER***/
    handleAddPeople = (e) => {
        if (e.target.value == 'true') {
            this.openAssignUserModal();
            this.setState({ addPeopleToFolder: true, addPeopleToFile: true })
        } else {
            this.setState({ addPeopleToFolder: false, addPeopleToFile: false, userListWithSearchQuery: [], assignedUser: [] })
        }
    }

    /*** FUNCTION DEFINATION TO HANDLE SUBMIT FOR CREATE FOLDER ***/
    handleSubmitForCreateFolder = (e) => {
        e.preventDefault();
        let isAbleToSubmit = false

        console.log(this.folderDetailsRef.current.value)

        if (this.folderDetailsRef.current.value.length > this.state.totalCharacterForFolderDetails) {
            showToast('error', 'Folder Details Exceeded ' + this.state.totalCharacterForFolderDetails + ' characters')
            isAbleToSubmit = false

        } else {
            isAbleToSubmit = true
        }

        if (this.folderNameRef.current.value != '' && this.folderNameRef.current.value != undefined) {
            isAbleToSubmit = true
        } else {
            isAbleToSubmit = false
        }

        if (isAbleToSubmit) {
            if (isEntityExist(this.props.globalState.personalFoldersReducer.list, this.folderNameRef.current.value)) {
                showToast('error', 'Folder name already exists')
            } else {
                let payload = {

                    "entity_name": this.folderNameRef.current.value,
                    "entity_description": this.folderDetailsRef.current.value,
                    "parent_directory_id": this.state.parentFolderId,
                    "directory_owner": this.state.createdBy

                }

                this.setState({ showLoader: true })
                CreateDirectory(payload).then(function (res) {
                    var response = res.data;
                    this.setState({ showLoader: false })
                    if (response.errorResponse.errorStatusCode != 1000) {
                        showToast('error', response.errorResponse.errorStatusType);
                    } else {
                        showToast('success', 'Folder created successfully');
                        this.folderNameRef.current.value = ''
                        this.folderDetailsRef.current.value = ''
                        this.setState({ showCreateFolderModal: false, showCreateFolderDropDown: false, addPeopleToFolder: false })
                        var insertedEntityId = response.lastRecordId
                        console.log(insertedEntityId)
                        if (this.state.assignedUser.length != 0) {
                            for (let i = 0; i < this.state.assignedUser.length; i++) {
                                let iter = this.state.assignedUser[i]
                                this.assignUserToEntity(iter, insertedEntityId)
                            }
                        }
                        this.fetchAllParentDirectory()

                    }
                }.bind(this)).catch(function (err) {
                    this.setState({ showLoader: false })
                    showHttpError(err)
                }.bind(this))
            }
        } else {
            showToast('error', 'Please provide valid information')
        }
    }





    /*** FUNCTION DEFINATION TO GET FOLDER OR FILE OWNER DETAILS ****/
    getEntityOwnerDetails = (param) => {
        let clients = this.props.globalState.clientListReducer.clientsList
        let employees = this.props.globalState.employeeListReducer.employeesList

        var ownerObj = {};

        if (clients != undefined) {
            for (let i = 0; i < clients.length; i++) {
                if (param == clients[i].user_id) {
                    ownerObj = {
                        ownerId: clients[i].user_id,
                        ownerName: clients[i].user_name,
                        ownerRole: clients[i].user_role,
                        ownerCompany: clients[i].user_company,
                        ownerEmail: clients[i].user_email,
                    }
                    break;
                }
            }
        } else {
            this.props.history.push('/dashboard')
        }

        if (employees != undefined) {
            for (let i = 0; i < employees.length; i++) {
                if (param == employees[i].user_id) {
                    ownerObj = {
                        ownerId: employees[i].user_id,
                        ownerName: employees[i].user_name,
                        ownerRole: employees[i].user_role,
                        ownerCompany: employees[i].user_company,
                        ownerEmail: employees[i].user_email,
                    }
                    break;
                }
            }
        } else {
            this.props.history.push('/dashboard')
        }

        return ownerObj;

    }


    /*** FUNCTION DEFINATION FOR GETTING FOLDER DETAILS ***/
    getFolderDetails = (parentFolderId, fromPage) => {
        console.log(parentFolderId, fromPage)
        var foldername = ''
        if (fromPage.indexOf('personal') != -1) {
            var parentPage = 'Personal Folders';
            var fallBackRoute = '/personal-folders'
            var folders = this.props.globalState.personalFoldersReducer.list;
        } else if (fromPage.indexOf('shared') != -1) {
            var parentPage = 'Shared Folders';
            var fallBackRoute = '/shared-folders'
            var folders = this.props.globalState.sharedFoldersReducer.list;
        } else if (fromPage.indexOf('favorite') != -1) {
            var parentPage = 'Favorite Folders';
            var fallBackRoute = '/favorite-folders'
            var folders = this.props.globalState.favoriteFoldersReducer.list;
        } else {
            var parentPage = fromPage;
            var fallBackRoute = '/personal-folders'
            var folders = this.props.globalState.personalFoldersReducer.list;
        }

        if (folders != undefined) {
            for (let i = 0; i < folders.length; i++) {
                if (parentFolderId == folders[i].entity_id) {
                    foldername = folders[i].entity_name
                    break;
                }
            }
            this.fetchAllParentDirectory()
        } else {
            this.props.history.push(fallBackRoute)
        }

        this.setState({
            parentFolderName: foldername,
            fromPage: parentPage,
        })

    }


    /*** FUNCTION DEFINATION FOR UPLOADING FILE ***/
    handleSubmitForUploadFile = (e) => {
        e.preventDefault();

        let file = document.getElementById('uploadFile');
        console.log(file.files)
        let filesArray = file.files;
        for (let i = 0; i < filesArray.length; i++) {
            let indi = filesArray[i];
            console.log(indi)
            if (indi.type === 'application/pdf') {
                let fd = new FormData();
                fd.append('file', indi)
                fd.append('parent_directory_id', this.state.parentFolderId)
                fd.append('directory_owner', this.state.createdBy)
                fd.append('file_type', 'FILE')

                this.setState({ showLoader: true })
                CreateFile(fd).then(function (res) {
                    var response = res.data;
                    this.setState({ showLoader: false })
                    if (response.errorResponse.errorStatusCode != 1000) {
                        showToast('error', response.errorResponse.errorStatusType);
                    } else {
                        showToast('success', 'File uploaded successfully');
                        this.setState({ showUploadFileModal: false, showCreateFolderDropDown: false, addPeopleToFolder: false })

                        this.fetchAllParentDirectory()
                        var insertedEntityId = response.lastRecordId
                        console.log(insertedEntityId)
                        if (this.state.assignedUser.length != 0) {
                            for (let i = 0; i < this.state.assignedUser.length; i++) {
                                let iter = this.state.assignedUser[i]
                                this.assignUserToEntity(iter, insertedEntityId)
                            }
                        }
                    }
                }.bind(this)).catch(function (err) {
                    this.setState({ showLoader: false })
                    showHttpError(err)
                }.bind(this))
            } else {
                showToast('error', 'Please provide pdf files only')
            }
        }
        //    let type = (file.files[0].name.split('.'))[1];
        //    if(type == 'pdf' ){

        //        let fd = new FormData();
        //        fd.append('file',file.files[0])
        //        fd.append('parent_directory_id',this.state.parentFolderId)
        //        fd.append('directory_owner',this.state.createdBy)
        //        fd.append('file_type','FILE')

        //        this.setState({showLoader : true})
        //        CreateFile(fd).then(function(res){
        //             var response = res.data;
        //             this.setState({showLoader : false})
        //             if(response.errorResponse.errorStatusCode != 1000){
        //                 showToast('error',response.errorResponse.errorStatusType);
        //             }else{
        //                 showToast('success','Folder created successfully');
        //                 this.setState({showUploadFileModal: false,showCreateFolderDropDown:false,addPeopleToFolder:false})

        //                 this.fetchAllParentDirectory()
        //                 var insertedEntityId = response.lastRecordId
        //                 console.log(insertedEntityId)
        //                 if(this.state.assignedUser.length != 0){
        //                     for(let i=0;i<this.state.assignedUser.length;i++){
        //                         let iter = this.state.assignedUser[i]
        //                         this.assignUserToEntity(iter,insertedEntityId)
        //                     }
        //                 }
        //             }
        //         }.bind(this)).catch(function(err){
        //             this.setState({showLoader : false})
        //             showHttpError(err)
        //         }.bind(this))

        //    }else{
        //         showToast('error','Please provide pdf files only')
        //    }

    }



    /*** FUNCTION DEFINATION TO GET ALL PARENT DIRECTORY AS PER AS USER TYPE ***/
    fetchAllParentDirectory = () => {
        let payload = { entity_id: this.state.parentFolderId }
        this.setState({ showLoader: true })
        GetAllSubDirectory(payload).then(function (res) {
            var response = res.data;
            this.setState({ showLoader: false })
            if (response.errorResponse.errorStatusCode != 1000) {
                showToast('error', response.errorResponse.errorStatusType);
            } else {

                let arr = [];
                let folders = response.response
                for (let i = 0; i < folders.length; i++) {
                    //  if(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role == 'ADMIN'){
                    arr.push(folders[i]);
                    // }else{
                    /* if(folders[i].directory_owner == JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id){
                         arr.push(folders[i]);
                     }  */
                    //}
                }
                arr = arr.reverse();
                this.setState({ foldersList: arr })
                this.props.setPersonalFoldersList(this.state.foldersList);
                console.log(this.state.foldersList)
                console.log(this.props.globalState)

            }
        }.bind(this)).catch(function (err) {
            this.setState({ showLoader: false })
            showHttpError(err)
        }.bind(this))
    }

    /*** FUNCTION DEFINATION TO MATCH FOLDER NAME WITH GIVEN INPUT ***/
    isUserMatched = (param) => {
        let arr = []
        if (param != '') {
            for (let i = 0; i < this.props.globalState.clientListReducer.clientsList.length; i++) {
                let iter = this.props.globalState.clientListReducer.clientsList[i]
                if ((iter.user_name).toLowerCase().indexOf((param).toLowerCase()) != -1) {
                    arr.push(iter)
                }
            }
        } else {
        }
        this.setState({ userListWithSearchQuery: arr })
        //console.log(this.state.userListWithSearchQuery)
    }

    /*** FUNCTION DEFINATION TO CHECK IF A FOLDER IS ALREADY ASSIGNED ****/
    isUserAlreadyAssigned = (param) => {
        if (this.state.assignedUser.includes(param)) {
            return true
        } else {
            return false
        }
    }
    /*** FUNCTION DEFINATION TO ASSiGN User to folder ****/
    handleSelectUser = (param) => {
        let arr = this.state.assignedUser
        console.log(arr.includes(param))
        if (!arr.includes(param)) {
            arr.push(param);
        } else {
            let index = arr.indexOf(param);
            console.log(index)
            if (index > -1) {
                arr.splice(index, 1);
            }
        }
        this.setState({ assignedUser: arr })
        console.log(this.state.assignedUser)
    }

    /*** function defination to handle folder details ***/
    handleFolderDetails = (param1, param2) => {
        this.props.history.push('/folder-details/' + param1 + '/' + param2)
        this.setState({ parentFolderId: param1 }, () => {

            this.getFolderDetails(param1, param2)
        })
    }

    /*** FUNCTION DEFINATION TO CALL API FOR ASSIGNING FOLDER TO USER ***/
    assignUserToEntity = (userId, entityId) => {
        let arr = []
        arr.push(userId)
        let payload = {
            entity_id: entityId,
            user_ids: arr
        }
        this.setState({ showLoader: true })
        console.log(payload)
        addDirectoryAssignedUser(payload).then(function (res) {
            var response = res.data;
            if (response.errorResponse.errorStatusCode != 1000) {
                this.setState({ showLoader: false })
                showToast('error', response.errorResponse.errorStatusType);
            } else {

                setTimeout(() => {
                    this.setState({

                        assignedUser: [],
                        showLoader: false,
                    })
                    showToast('success', 'Folder Assigned Successfully');
                }, 3000);

            }
        }.bind(this)).catch(function (err) {
            this.setState({ showLoader: false })
            showHttpError(err)
        }.bind(this))
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
                    const match = matchPath(this.props.history.location.pathname, {
                        path: '/folder-details/:param1/:param2',
                        exact: true,
                        strict: false
                    })
                    console.log(match.params)
                    this.setState({ parentFolderId: match.params.param1 }, () => {

                        this.getFolderDetails(match.params.param1, match.params.param2)
                    })
                }
            }.bind(this)).catch(function (err) {
                this.setState({ showLoader: false })
                showHttpError(err)
            }.bind(this))
        })
    }
    /**** FUNCTION DEFINATION FOR SELECTION ALL ENTITY ****/
    selectAllEntity = (e) => {
        let checkedValue = e.target.checked
        console.log(checkedValue)
        let elem = document.getElementsByClassName('desCheckBox');
        for (let i = 0; i < elem.length; i++) {
            if (checkedValue) {
                if (elem[i].checked === false) {
                    elem[i].click();
                }
            } else {
                elem[i].click();
            }
        }
    }
    /*** Function defination to select multiple entity for deletion using check box ***/
    handleSelectMultiEntity = (e) => {
        let arr = this.state.selectedEntityArray;
        let id = e.target.getAttribute("data-id");
        if (e.target.checked) {
            arr.push(id)
        } else {
            var index = arr.indexOf(id);
            if (index > -1) {
                arr.splice(index, 1);
            }
        }
        this.setState({ selectedEntityArray: arr })
    }

    /*** Function defination to for deleting entity by multiselect ***/
    handleDeleteByMutliSelect = () => {
        let arr = this.state.selectedEntityArray
        showConfirm('Delete', 'Are you sure want to delete?', 'warning', () => {
            for (let i = 0; i < arr.length; i++) {
                let payload = { entity_id: arr[i] }
                removeDirectory(payload).then(function (res) {
                    var response = res.data;
                    if (response.errorResponse.errorStatusCode != 1000) {
                        this.setState({ showLoader: false })
                        showToast('error', response.errorResponse.errorStatusType);
                    } else {
                        if (i + 1 === arr.length) {
                            showToast('success', 'Document Deleted Successfully');
                            const match = matchPath(this.props.history.location.pathname, {
                                path: '/folder-details/:param1/:param2',
                                exact: true,
                                strict: false
                            })
                            console.log(match.params)
                            this.setState({ parentFolderId: match.params.param1 }, () => {



                                this.getFolderDetails(match.params.param1, match.params.param2)
                            })
                        }
                    }
                }.bind(this)).catch(function (err) {
                    this.setState({ showLoader: false })
                    showHttpError(err)
                }.bind(this))
            }

        })
    }


    render() {
        return (
            <Fragment>
                <Header />
                <div className="app-body">
                    <Sidebar />
                    <main className="main">
                        <div className="container-fluid">
                            <div id="ui-view">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="card card_cstm same_dv_table">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="lft-hdr"><span><i className="fas fa-folder-open"></i></span>{this.state.fromPage} <i class="fas fa-arrow-right ml-2 mr-2"></i>  {this.state.parentFolderName}</div>
                                                    <div className="lft-hdr">
                                                        {this.state.loggedInUserRole === 'ADMIN' && this.state.selectedEntityArray.length > 0 ? <a href="javascript:void(0)" className="ml-2 btn btn-danger" onClick={this.handleDeleteByMutliSelect}> <i className="fas fa-trash-alt"></i>Delete Selected</a> : ''}
                                                    </div>
                                                    <div className="addbutton">
                                                        <span className={this.state.showCreateFolderDropDown ? "addbutton_click cross" : "addbutton_click"} onClick={() => { this.setState({ showCreateFolderDropDown: !this.state.showCreateFolderDropDown }) }}><i className="fas fa-plus"></i></span>
                                                        <div className={this.state.showCreateFolderDropDown ? "drop_menu view_drop" : "drop_menu"}>
                                                            <button type="button" data-toggle="modal" data-target="#creatfolderModal" onClick={this.openCreateFolderModal}><i className="fas fa-folder-open"></i>Create Folder</button>
                                                            <button type="button" onClick={this.openUploadFileModal}><i className="fas fa-file-pdf"></i>Upload File</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_sharedfolders">
                                                <div className="dash_lft_t">
                                                    <table className="table_all table dt-responsive nowrap">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    <div className="custom-control custom-checkbox">
                                                                        <input type="checkbox" className="custom-control-input " id="check_all" onClick={(event) => { this.selectAllEntity(event) }} />
                                                                        <label className="custom-control-label" htmlFor="check_all"></label>
                                                                    </div>
                                                                </th>
                                                                <th>Name</th>
                                                                {/* <th>Size</th> */}
                                                                <th>Uploaded</th>
                                                                <th>Create</th>
                                                                <th>Details</th>
                                                            </tr>
                                                        </thead>
                                                        {this.state.foldersList.length != 0 ? <tbody>
                                                            {this.state.foldersList.map((list) =>
                                                                <tr className="pointer-cursor" key={list.entity_id}>
                                                                    <td>
                                                                        <div className="custom-control custom-checkbox">
                                                                            <input type="checkbox" className="custom-control-input checkbox desCheckBox" data-id={list.entity_id} id={list.entity_id} onClick={(e) => { this.handleSelectMultiEntity(e) }} />
                                                                            <label className="custom-control-label" htmlFor={list.entity_id}></label>
                                                                        </div>
                                                                    </td>
                                                                    <td><span className="select" onClick={() => { manipulateFavoriteEntity(list.entity_id, []) }}><i className="far fa-star"></i></span><span className="foldericon"><i className={list.is_directory ? "fas fa-folder-open" : "fas fa-file-pdf"}></i></span><a href="#!">{list.entity_name}</a></td>

                                                                    <td>
                                                                        <Moment format="YYYY/MM/DD HH:mm:ss" date={list.entity_created} />
                                                                    </td>
                                                                    <td>{this.getEntityOwnerDetails(list.directory_owner).ownerName}</td>
                                                                    <td>{list.is_directory ? <button className="btn btn-primary" onClick={() => { this.handleFolderDetails(list.entity_id, list.entity_name) }}> <i className="fas fa-eye"></i>  Details</button> : <a href={FILEPATH + list.entity_location.replace("../", "")} target="_blank" className="btn btn-warning"> <i className="fas fa-eye"></i> Show</a>}</td>
                                                                </tr>)}

                                                        </tbody> : <tbody><tr><td className="text-center" colSpan="4">Folder is Empty </td></tr></tbody>}
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
                            <form onSubmit={this.handleSubmitForCreateFolder}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" placeholder="Name" ref={this.folderNameRef} />
                                </div>
                                <div className="form-group">
                                    <label>Details</label>
                                    <textarea className="form-control" rows="5" placeholder="Details" ref={this.folderDetailsRef} ></textarea>
                                    <small className="form-text text-muted text-right">Character Limit: {this.state.totalCharacterForFolderDetails}</small>
                                </div>
                                <div className="form-group">
                                    <label>Add People To Folder</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="AddPeople" value="true" checked={this.state.addPeopleToFolder == true} onClick={(event) => { this.handleAddPeople(event) }} />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="AddPeople" value="false" checked={this.state.addPeopleToFolder == false} onClick={(event) => { this.handleAddPeople(event) }} />
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
                            <form onSubmit={this.handleSubmitForUploadFile}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="file" className="form-control" placeholder="Name" id="uploadFile" ref={this.fileRef} multiple />
                                </div>

                                <div className="form-group">
                                    <label>Add People To Folder</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="AddPeople" value="true" checked={this.state.addPeopleToFile == true} onClick={(event) => { this.handleAddPeople(event) }} />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="AddPeople" value="false" checked={this.state.addPeopleToFile == false} onClick={(event) => { this.handleAddPeople(event) }} />
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
                                <input type="text" className="form-control" placeholder="Search Folder" onKeyUp={(event) => { this.isUserMatched(event.target.value) }} />
                                {/*  <div className="input-group-append">
                            <button className="btn btn-outline-secondary" type="button">Search</button>
                        </div> */}
                            </div>
                            <ul className="">
                                {this.state.userListWithSearchQuery.map((list) =>
                                    <li className="list-group-item" key={list.user_id}>
                                        <div className="row">
                                            <div className="col-md-2">
                                                <input type="checkbox" checked={this.isUserAlreadyAssigned(list.user_id) ? 'checked' : ''} onClick={() => { this.handleSelectUser(list.user_id) }} />
                                            </div>
                                            <div className="col-md-8">{list.user_name}</div>
                                        </div>
                                    </li>)}
                            </ul>

                        </div>
                    </Modal.Body>

                </Modal>

                <Footer />
                <Loader show={this.state.showLoader} />
            </Fragment>

        )
    }
    componentDidMount() {

        /*** FOLDER DETIALS LIST ***/
        const match = matchPath(this.props.history.location.pathname, {
            path: '/folder-details/:param1/:param2',
            exact: true,
            strict: false
        })
        // console.log(match.params)
        //console.log(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))))
        console.log(this.state.loggedInUserRole)
        this.setState({ parentFolderId: match.params.param1 }, () => {

            this.getFolderDetails(match.params.param1, match.params.param2)
        })


    }


}
const mapStateToProps = state => {
    return {
        globalState: state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setPersonalFoldersList: (array) => dispatch(setPersonalFoldersList(array)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FolderDetails))

