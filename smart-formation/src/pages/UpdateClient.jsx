import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SITENAMEALIAS } from '../utils/init';
import {UpdateUser} from '../utils/service'


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
            userType : 'CLIENT',
            userRole : 'CLIENT',
            userCreatedBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            isUserGrouped : false
            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleUpdateClient = this.handleUpdateClient.bind(this)
        this.getSelectedClientDetails = this.getSelectedClientDetails.bind(this)
        this.updateClient = this.updateClient.bind(this)
      
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
       
   }

   
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

export default connect(mapStateToProps,null)(UpdateClient)

