import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Link } from 'react-router-dom';
import {setEmployeeList,setClientList } from "../utils/redux/action"
import { connect } from 'react-redux';
import { GetAllUser } from '../utils/service'
import { showToast,showHttpError } from '../utils/library'


 class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            pageNo : 1,
            noOfItemsPerPage : 20,
            loggedInUserName : 'Guest',
            recentFileList : []
        };

        /**** BIND FUNCTIONS ****/
        this.getAllEmployeesList = this.getAllEmployeesList.bind(this)
        this.getAllClientsList = this.getAllClientsList.bind(this)
      
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
                                        <div className="user_addimage">
                                            <a href="#!">add profile pictuer</a>
                                        </div>
                                        <div className="edit_dashboard">
                                            <span><i className="fas fa-th-large"></i>Edit Dashboard</span>
                                        </div>
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
                                                            <i className="fas fa-file-pdf"></i>
                                                        </div>
                                                        <div className="recent_file_item_filename">
                                                            <p>{list.entity_name}</p>
                                                            <ul className="recent_file_item_path">
                                                                <li><a href="#!">Shared Folders</a></li>
                                                                <li><a href="#!">Abc</a></li>
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
                                            <div className="lft-hdr"><span><i className="fas fa-share"></i></span>Sortcuts</div>
                                        </div>
                                        </div>
                                    <div className="card-body custom_card_body_sortcut">
                                        <div className="sortcut_area">
                                            <ul>
                                                <li><Link to="/dashboard"><span><i className="fas fa-share"></i></span>Share Files</Link></li>
                                                <li><Link to="/dashboard"><span><i className="fas fa-reply"></i></span>Request Files</Link></li>
                                                <li><Link to="/manage-user-home"><span><i className="fas fa-user-plus"></i></span>Create New User</Link></li>
                                                <li><Link to="/dashboard"><span><i className="fas fa-user"></i></span>Personal Folders</Link></li>
                                                <li><Link to="/dashboard"><span><i className="fas fa-user-friends"></i></span>Shared Folders</Link></li>
                                                <li><Link to="/dashboard"><span><i className="fas fa-star"></i></span>Favorites</Link></li>
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
                                            <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a className="nav-item nav-link active" id="nav-videos-tab" data-toggle="tab" href="#nav-videos" role="tab" aria-controls="nav-videos" aria-selected="true">Videos</a>
                                                <a className="nav-item nav-link" id="nav-helpfullinks-tab" data-toggle="tab" href="#nav-helpfullinks" role="tab" aria-controls="nav-helpfullinks" aria-selected="false">Helpful Links</a>
                                            </div>
                                            </nav>
                                            <div className="tab-content" id="nav-tabContent">
                                            <div className="tab-pane fade show active" id="nav-videos" role="tabpanel" aria-labelledby="nav-videos-tab">
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
                                            </div>
                                            <div className="tab-pane fade" id="nav-helpfullinks" role="tabpanel" aria-labelledby="nav-helpfullinks-tab">
                                                <div className="helpful_area">
                                                    <ul>
                                                        <li><a href="#!">Link1</a></li>
                                                    </ul>
                                                </div>
                                            </div>
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
        if(loggedInUser.user_name != undefined ){
            this.setState({loggedInUserName : loggedInUser.user_name})
        }

        /*** CALLING FUNCTION FOR GET ALL EMPLOYEES LIST***/
        this.getAllEmployeesList()

        /*** CALLING FUNCTION FOR GET ALL CLIENTS LIST***/
        this.getAllClientsList()
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
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Dashboard)

