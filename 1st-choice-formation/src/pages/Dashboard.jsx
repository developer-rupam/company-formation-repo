import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Link } from 'react-router-dom';
import {setEmployeeList,setClientList,setPersonalFoldersList } from "../utils/redux/action"
import { connect } from 'react-redux';
import { GetAllUser,GetAllSubDirectory } from '../utils/service'
import { showToast,showHttpError } from '../utils/library'


 class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            pageNo : 1,
            noOfItemsPerPage : 100000,
            loggedInUserName : 'Guest',
            recentFileList : [],
            hasAccessToManageEmployees : false,
			hasAccessToManageClients : false
        };

        /**** BIND FUNCTIONS ****/
        this.getAllEmployeesList = this.getAllEmployeesList.bind(this)
        this.getAllClientsList = this.getAllClientsList.bind(this)
        this.getLoggedInUserDetailsForPermission = this.getLoggedInUserDetailsForPermission.bind(this);
        this.getRecentFiles = this.getRecentFiles.bind(this);
        this.getEntityOwnerDetails = this.getEntityOwnerDetails.bind(this);

      
    }


    /*** FUNCTION DEFINATION TO GET EMPLOYEE LIST ****/
    getAllEmployeesList = () =>{
        let payload ={
            page_no : this.state.pageNo,
            page_size : this.state.noOfItemsPerPage,
        }
        this.setState({showLoader : true})
        GetAllUser(payload).then(function(res){
            this.setState({showLoader : false})
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                let employeesList = response.response;
                this.props.setEmployeeList(employeesList);
            }
        }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))

    }

    /**** FUNCTION DEFINATION TO GET CLIENT LIST****/
    getAllClientsList = () =>{
        let payload ={
            page_no : this.state.pageNo,
            page_size : this.state.noOfItemsPerPage,
        }
        this.setState({showLoader : true})
        GetAllUser(payload).then(function(res){
            this.setState({showLoader : false})
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                let allClientsList = response.response;
                let clientsList = [];
                for(let i=0;i<allClientsList.length;i++){
                    if(allClientsList[i].user_role == 'CLIENT' && allClientsList[i].created_by == JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id){
                        clientsList.push(allClientsList[i])
                    }
                }
                this.props.setClientList(clientsList);
               
            }
        }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))
    }

    /*** FUNCTION DEFINATION TO GET LOGGED IN USER DETAILS FOR PERMISSION ***/
    getLoggedInUserDetailsForPermission = () => {
        let session = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session')))
        console.log(session)
        if(session.user_role == 'ADMIN'){
            var manageClients = true;
            var manageEmployees = true;
        }else if(session.user_role == 'CLIENT'){
            var manageClients = false;
            var manageEmployees = false;
        }else{
            var manageClients = session.manage_client;
            var manageEmployees = session.manage_employee;
        }
        this.setState({
            hasAccessToManageClients : manageClients,
            hasAccessToManageEmployees : manageEmployees,
        })
    }


      /*** FUNCTION DEFINATION TO GET ALL PARENT DIRECTORY AS PER AS USER TYPE ***/
   getRecentFiles = () => {
    let payload = {entity_id : '',page : 1,limit:50,sort:-1,searchQuery:''}
    this.setState({showLoader : true})
    GetAllSubDirectory(payload).then(function(res){
                var response = res.data;
                this.setState({showLoader : false})
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    
                    let arr = [];
                    let recentFilesArr = [];
                    let folders = response.response
                    for(let i=0;i<folders.length;i++){
                        if(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role == 'ADMIN'){
                            arr.push(folders[i]);
                        }else{
                            let userIds = folders[i].asigned_user_ids
                            for(let j=0;j<userIds.length;j++){
                                console.log(userIds[j],JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id)
                                if(userIds[j] == JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id){
                                    arr.push(folders[i]);
                                }
                            }
                        }
                    }
                    //this.setState({recentFileList : arr})
                    let range = 0
                    if(arr.length > 5){
                        range = 5
                    }
                    console.log(arr.length,range)
                    for(let i=arr.length - 1;i>=range;i--){
                        recentFilesArr.push(arr[i])
                    }
                    console.log(recentFilesArr)
                    this.setState({recentFileList : recentFilesArr})

                    this.props.setPersonalFoldersList(arr);
                    console.log(this.props.globalState)
                    
                }
            }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err)
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
       // this.props.history.push('/dashboard')
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
       // this.props.history.push('/dashboard')
    }
  
    return ownerObj;
  
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
                                    <div className="user_det">
                                       
                                        <div className="user_image_name">
                                            <span>AT</span>
                                        </div>
                                        <div className="user_welcome">
                                            <span>Hello {this.state.loggedInUserName}</span>
                                        </div>
                                        {/* <div className="user_addimage">
                                            <a href="#!">add profile pictuer</a>
                                        </div>
                                        <div className="edit_dashboard">
                                            <span><i className="fas fa-th-large"></i>Edit Dashboard</span>
                                        </div> */}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card card_cstm same_dv_table">
                                        <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="lft-hdr"><span><i className="fas fa-file"></i></span>Recent File</div>
                                        </div>
                                        </div>
                                    <div className="card-body custom_card_body">
                                    <span>These are the items you recently accessed. This private list is only visable to you</span>
                                        <div className="recent_file_area">
                                            <ul className="recent_file_item_list">
                                                { this.state.recentFileList.map((list) =>
                                                <li key={list.entity_id}>
                                                    <div className="recent_file_item">
                                                        <div className="recent_file_item_icon">
                                                            <i className={list.is_file ? "fas fa-file-pdf" : "fas fa-folder-open"}></i>
                                                        </div>
                                                        <div className="recent_file_item_filename">
                                                            <p>{list.entity_name}</p>
                                                            <ul className="recent_file_item_path">
                                                                <li><a href="#!">Personal Folders</a></li>
                                                <li><a href="#!">{this.getEntityOwnerDetails(list.directory_owner).ownerName}</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                                )}
                                            </ul>
                                        
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card card_cstm same_dv_table">
                                        <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="lft-hdr"><span><i className="fas fa-share"></i></span>Shortcuts</div>
                                        </div>
                                        </div>
                                    <div className="card-body custom_card_body_sortcut">
                                        <div className="sortcut_area">
                                            <ul>
                                               {/*  <li><Link to="/dashboard"><span><i className="fas fa-share"></i></span>Share Files</Link></li>
                                                <li><Link to="/dashboard"><span><i className="fas fa-reply"></i></span>Request Files</Link></li> */}
                                                { (this.state.hasAccessToManageClients || this.state.hasAccessToManageEmployees) ? <li><Link to="/manage-user-home"><span><i className="fas fa-user-plus"></i></span>Create New User</Link></li> :''}
                                                <li><Link to="/personal-folders"><span><i className="fas fa-folder"></i></span>Personal Folders</Link></li>
                                                <li className={this.state.hasAccessToManageClients ? '' : 'ml-2'} style={{marginTop : '-16px'}}><Link to="/shared-folders"><span><i className="fas fa-folder-open"></i></span>Shared Folders</Link></li>
                                                <li className={this.state.hasAccessToManageClients ? '' : 'ml-2'} style={{marginTop : '-36px'}}><Link to="/favorite-folders"><span><i className="fas fa-star"></i></span>Favorites</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card card_cstm same_dv_table">
                                        <div className="card-header">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="lft-hdr"><span><i className="fas fa-book-open"></i></span>Tutorials</div>
                                            <div className="right-hdr">
                                                <div className="header_drop">
                                                    <form>
                                                    <select className="selectpicker show-tick form-control">
                                                        <option selected>Basics</option>
                                                        <option>Advance</option>
                                                    </select>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    <div className="card-body custom_card_body_tutorials">
                                        <div className="tutorials_area">
                                            <h5>Coming soon...</h5>
                                            {/* <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a className="nav-item nav-link active" id="nav-videos-tab" data-toggle="tab" href="#nav-videos" role="tab" aria-controls="nav-videos" aria-selected="true">Videos</a>
                                                <a className="nav-item nav-link" id="nav-helpfullinks-tab" data-toggle="tab" href="#nav-helpfullinks" role="tab" aria-controls="nav-helpfullinks" aria-selected="false">Helpful Links</a>
                                            </div>
                                            </nav> */}
                                            <div className="tab-content" id="nav-tabContent">
                                            {/* <div className="tab-pane fade show active" id="nav-videos" role="tabpanel" aria-labelledby="nav-videos-tab">
                                            <div className="video_area">
                                                <div className="col-md-12">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="video_item">
                                                                <div className="video_item_main_video">
                                                                    <img src={require("../assets/image/video.png")} className="img-fluid"/>
                                                                </div>
                                                                <div className="video_item_content">
                                                                    <span>Add People To Your Account</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="video_item">
                                                                <div className="video_item_main_video">
                                                                    <img src={require("../assets/image/video.png")} className="img-fluid"/>
                                                                </div>
                                                                <div className="video_item_content">
                                                                    <span>Add People To Your Account</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4">
                                                            <div className="video_item">
                                                                <div className="video_item_main_video">
                                                                    <img src={require("../assets/image/video.png")} className="img-fluid"/>
                                                                </div>
                                                                <div className="video_item_content">
                                                                    <span>Add People To Your Account</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div> */}
                                            {/* <div className="tab-pane fade" id="nav-helpfullinks" role="tabpanel" aria-labelledby="nav-helpfullinks-tab">
                                                <div className="helpful_area">
                                                    <ul>
                                                        <li><a href="#!">Link1</a></li>
                                                    </ul>
                                                </div>
                                            </div> */}
                                            </div>
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
        
        /*** Setting up dashboard pages with txt and functionalities manipulation ***/
        let loggedInUser = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session')))
        console.log(loggedInUser.user_name)
        if(loggedInUser.user_name !== undefined ){
            this.setState({loggedInUserName : loggedInUser.user_name})
            /** Calling FUNCTION TO GET LOGGED IN USER DETAILS ***/
		    this.getLoggedInUserDetailsForPermission();
        }else if(loggedInUser.user_role == 'EMPLOYEE'){
            this.setState({loggedInUserName : loggedInUser.employee_name})
            /** Calling FUNCTION TO GET LOGGED IN USER DETAILS ***/
		    this.getLoggedInUserDetailsForPermission();
        }else{
            this.setState({loggedInUserName : 'ADMIN'})
            /** Calling FUNCTION TO GET LOGGED IN USER DETAILS ***/
		    this.getLoggedInUserDetailsForPermission();
        }

        /*** CALLING FUNCTION FOR GET ALL EMPLOYEES LIST***/
        this.getAllEmployeesList()

        /*** CALLING FUNCTION FOR GET ALL CLIENTS LIST***/
        this.getAllClientsList()


        /*** CALLING FUNCTION FOR GET ALL RECENT FILES***/
        this.getRecentFiles()
    }
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setEmployeeList : (array) => dispatch(setEmployeeList(array)),
        setClientList : (array) => dispatch(setClientList(array)),
        setPersonalFoldersList : (array) => dispatch(setPersonalFoldersList(array)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)

