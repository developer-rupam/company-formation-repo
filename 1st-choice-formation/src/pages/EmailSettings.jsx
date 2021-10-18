import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { showToast,showConfirm,showHttpError } from '../utils/library'
import { Link,withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SITENAMEALIAS } from '../utils/init';
import {upsertEmailTemplate,getEmailTemplate} from '../utils/service'
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';


 class EmailSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            sessionObj:{},
            textareaWidth : 930,
            textareaHeight : 200,
            showLoader : false,
            templateTypeList:[
                {id:1,type:'create_client',messageBody: ''},
                {id:2,type:'create_entity',messageBody: ''},
                {id:3,type:'send_login_credential',messageBody: ''},
            ],
            userCreatedBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            createClientMessageBody : '',
            createEntityMessageBody : '',
            sendLoginCredentialMessageBody : '',
        };

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.createClientMessageBodyRef = React.createRef();
        this.createEntityMessageBodyRef = React.createRef();
        this.sendLoginCredentialMessageBodyRef = React.createRef();
        


         /***  BINDING FUNCTIONS  ***/
         this.getAllEmailTemplate = this.getAllEmailTemplate.bind(this);
         this.saveEmailTemplate = this.saveEmailTemplate.bind(this);
       
    }

    /*** FUNCTION DEFINATION TO GET EMAIL TEMPLATES ***/
    getAllEmailTemplate = (param) => {
        let payload = {email_template_type : param}
        this.setState({showLoader : true})
        getEmailTemplate(payload).then(function(res){
                var response = res.data;
                this.setState({showLoader : false})
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    if(response.response.email_template_type !== undefined){
                        let temp1 = '';
                        let temp2 = '';
                        let temp3 = '';
                        if(response.response.email_template_type === '1'){
                            temp1 = response.response.email_template_body
                            this.createClientMessageBodyRef.current.value = temp1;
                            this.setState({createClientMessageBody : temp1})
                        }else if(response.response.email_template_type === '2'){
                            temp2 = response.response.email_template_body
                            this.createEntityMessageBodyRef.current.value = temp2;
                            this.setState({createEntityMessageBody : temp2})

                        }else if(response.response.email_template_type === '3'){
                            temp3 = response.response.email_template_body
                            this.sendLoginCredentialMessageBodyRef.current.value = temp3;
                            this.setState({sendLoginCredentialMessageBody : temp3})

                        }
                        
                    }
                    
                    
                }
        }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
              showHttpError(err,this.props)
        }.bind(this))
    }

    /*** FUNCTION DEFINATION TO SAVE EMAIL TEMPLATES ***/
    saveEmailTemplate = (param1,param2) => {
        let payload = {email_template_type : param1,email_template_body:param2,directory_owner:this.state.userCreatedBy}
        this.setState({showLoader : true})
        console.log(payload)
        upsertEmailTemplate(payload).then(function(res){
                var response = res.data;
                this.setState({showLoader : false})
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    /*** CALLING FUNCTION TO GET TEMPLATE DETAILS ***/
                    for(let i= 0;i<this.state.templateTypeList.length;i++){
                        this.getAllEmailTemplate(this.state.templateTypeList[i].id);
                    }
    
                }
        }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
              showHttpError(err,this.props)
        }.bind(this))
    }
    
    /*** FUNCTION DEFINATION TO HANDLE SAVE BUUTON EVENT ***/
    handleSaveTemplate = () =>{
        for(let i= 0;i<this.state.templateTypeList.length;i++){
            console.log(this.createEntityMessageBodyRef.current.value)
             if(this.state.templateTypeList[i].id === 1){

                this.saveEmailTemplate(this.state.templateTypeList[i].id,this.state.createClientMessageBody);
            }else if(this.state.templateTypeList[i].id === 2){

                this.saveEmailTemplate(this.state.templateTypeList[i].id,this.state.createEntityMessageBody);
            }else if(this.state.templateTypeList[i].id === 3){

                this.saveEmailTemplate(this.state.templateTypeList[i].id,this.state.sendLoginCredentialMessageBody);
            } 
        }
    }

    /**** FUNCTION DEFINATION TO GET CREATE CLIENT MESSAGE BODY *****/
    handleUpdatedCreateClientMessageBody = (e) =>{
        this.setState({
            createClientMessageBody : e
        })
    }
    
    /**** FUNCTION DEFINATION TO GET CREATE CLIENT MESSAGE BODY *****/
    handleUpdatedCreateEntityMessageBody = (e) =>{
        this.setState({
            createEntityMessageBody : e
        })
    }

    /**** FUNCTION DEFINATION TO GET CREATE CLIENT MESSAGE BODY *****/
    handleUpdatedSendCredentialMessageBody = (e) =>{
        this.setState({
            sendLoginCredentialMessageBody : e
        })
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
                                                <span><i className="fas fa-user-plus"></i></span>Email Settings
                                            </div>
                                            <div className="rght-hdr ">
                                                
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_addclientmain">

                                        <div className="card card_cstm same_dv_table cust_back_card">
                                            <div className="card-header">
                                                <div className="d-flex justify-content-between align-items-center">
                                                <div className="lft-hdr"><span>1</span>Create Client Email Template</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-12">
                                                                        <label>Message Body</label>
                                                                        
                                                                        {/* <textarea className="form-control" placeholder="Create client message body" cols={this.state.textareaWidth} rows={this.state.textareaHeight}
                                                                       ref={this.createClientMessageBodyRef}></textarea> */}
                                                                        <SunEditor ref={this.createClientMessageBodyRef} height={this.state.textareaHeight} width={this.state.textareaWidth} setContents={this.state.createClientMessageBody} onChange={this.handleUpdatedCreateClientMessageBody}/>

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
                                                <div className="lft-hdr"><span>2</span>Assigned File Email Template</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-12">
                                                                        <label>Message Body</label>
                                                                        
                                                                        {/* <textarea className="form-control" placeholder="Create folder/file message body" cols={this.state.textareaWidth} rows={this.state.textareaHeight}
                                                                        ref={this.createEntityMessageBodyRef} ></textarea> */}
                                                                        <SunEditor ref={this.createEntityMessageBodyRef} height={this.state.textareaHeight} width={this.state.textareaWidth} setContents={this.state.createEntityMessageBody} onChange={this.handleUpdatedCreateEntityMessageBody}/>
                                                                        <p className="error">*For generating folder name where a file has been uploaded use identifier ASSIGNED_FOLDER_NAME </p>
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
                                                <div className="lft-hdr"><span>3</span>Send login credentials to client template</div>
                                               
                                                </div>
                                            </div>
                                            <div className="card-body custom_card_body_addclientsecond">
                                                <div className="row">
                                                <div className="col-md-12">
                                                    <div className="createclient_main_body">
                                                        <form >
                                                            <div className="detailcreate_area">
                                                            
                                                                <div className="form-row addClientRow" >
                                                                    <div className="form-group col-md-12">
                                                                        <label>Message Body</label>
                                                                        
                                                                        {/* <textarea className="form-control" placeholder="Send login credentials to client message body" cols={this.state.textareaWidth} rows={this.state.textareaHeight}
                                                                       ref={this.sendLoginCredentialMessageBodyRef}></textarea> */}
                                                                        <SunEditor ref={this.sendLoginCredentialMessageBodyRef} height={this.state.textareaHeight} width={this.state.textareaWidth} setContents={this.state.sendLoginCredentialMessageBody} onChange={this.handleUpdatedSendCredentialMessageBody}/>
                                                                       <p className="error">*For generating email and password use keyword USER_EMAIL_IDENTIFIER & USER_PASSWORD_IDENTIFIER</p>
                                                                    </div>
                                                                    
                                                                </div>
                                                            
                                                            </div>
                                                        </form>
                                                      
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                        </div>



                                        <div className="modal_button_area">
                                             <button type="button" className="submit" onClick={this.handleSaveTemplate}>Save</button>
                                           
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

       /*** CALLING FUNCTION TO GET TEMPLATE DETAILS ***/
       for(let i= 0;i<this.state.templateTypeList.length;i++){
           this.getAllEmailTemplate(this.state.templateTypeList[i].id);
       }
       
   }

   
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

export default connect(mapStateToProps,null)(withRouter(EmailSettings))

