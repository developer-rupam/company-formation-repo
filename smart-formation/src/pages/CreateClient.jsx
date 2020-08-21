import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';

export default class CreateClient extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addClientList : [{index : 1, name : '',email : '',company :'',password : ''}],
            showLoader : false,
            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleAddClientRow = this.handleAddClientRow.bind(this)
        this.handleSubmitClient = this.handleSubmitClient.bind(this)
        this.handleDeleteClientRow = this.handleDeleteClientRow.bind(this)
      
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
      
    }

    /*** FUNCTION DEFINATION FOR DELETING CLIENT ROW ***/
    handleDeleteClientRow = (param) =>{
       
        let addClientList = this.state.addClientList
        addClientList = addClientList.filter(list => list.index != param)
        this.setState({addClientList:addClientList})
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
                                                    <button type="button" data-toggle="modal" data-target="#importModal" className="addclient"><i className="fas fa-user-plus"></i>Import Multiple Users With Excel</button>
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
                                                                        defaultChecked={list.name}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Email</label>
                                                                        <input type="text" className="form-control" placeholder="Email" 
                                                                        defaultChecked={list.email}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Company(optional)</label>
                                                                        <input type="text" className="form-control" placeholder="Company"
                                                                        defaultChecked={list.company}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Password</label>
                                                                        <input type="text" className="form-control" placeholder="Password" 
                                                                        defaultChecked={list.password}/>
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
                                                            <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                                                            <label className="custom-control-label" htmlFor="customCheck1">Change Their Password</label>
                                                            </div>
                                                            <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="customCheck2"/>
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
                                            <button type="button" className="submit" onClick={this.addClients}>Submit</button>
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

   
    
}

