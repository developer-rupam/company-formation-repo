import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast } from '../utils/library'
import readXlsxFile from 'read-excel-file'

export default class CreateEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addEmployeeList : [{index : 1, name : '',email : '',company :'',password : ''}],
            showLoader : false,
            showImportModal : false,
            
        };
         /***  BINDING FUNCTIONS  ***/
        this.handleAddEmployeeRow = this.handleAddEmployeeRow.bind(this)
        this.handleSubmitEmployee = this.handleSubmitEmployee.bind(this)
        this.handleDeleteEmployeeRow = this.handleDeleteEmployeeRow.bind(this)
        this.handleCsvFile = this.handleCsvFile.bind(this)
        this.openImportModal = this.openImportModal.bind(this)
        this.closeImportModal = this.closeImportModal.bind(this)
      
    }

    /**** function defination for adding employees ****/
    handleAddEmployeeRow = () =>{
        let employeeListArr = this.state.addEmployeeList
        let nextIndex = (this.state.addEmployeeList).length+1
        let employeeListObj = {index : nextIndex, name: '',email : '',company :'',password : ''}
        employeeListArr.push(employeeListObj)
        this.setState({addEmployeeList : employeeListArr})
    }

    /**** function defination for submit employees ****/
    handleSubmitEmployee = () =>{
      
    }

    /*** FUNCTION DEFINATION FOR DELETING EMPLOYEE ROW ***/
    handleDeleteEmployeeRow = (param) =>{
       
        let addEmployeeList = this.state.addEmployeeList
        addEmployeeList = addEmployeeList.filter(list => list.index != param)
        this.setState({addEmployeeList:addEmployeeList})
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
             console.log(arr)
             this.setState({addEmployeeList : arr})
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
                                            <div className="lft-hdr"><span><i className="fas fa-user-plus"></i></span>Create New Employee</div>
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
                                                    <div className="CreateEmployee_main_body">
                                                    {this.state.addEmployeeList.map((list) =>
                                                        <form key={list.index}>
                                                            <div className="detailcreate_area">
                                                            <span className="delete_add_row" onClick={() => this.handleDeleteEmployeeRow(list.index)}><i className="fas fa-trash"></i></span>
                                                            
                                                                <div className="form-row addEmployeeRow" >
                                                                    <div className="form-group col-md-4">
                                                                        <label>Name</label>
                                                                        <input type="text" className="form-control" placeholder="Name"
                                                                        defaultValue={list.name}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Email</label>
                                                                        <input type="text" className="form-control" placeholder="Email" 
                                                                        defaultValue={list.email}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Company(optional)</label>
                                                                        <input type="text" className="form-control" placeholder="Company"
                                                                        defaultValue={list.company}/>
                                                                    </div>
                                                                    <div className="form-group col-md-4">
                                                                        <label>Password</label>
                                                                        <input type="text" className="form-control" placeholder="Password" 
                                                                        defaultValue={list.password}/>
                                                                    </div>
                                                                </div>
                                                            
                                                            </div>
                                                        </form>
                                                        )}
                                                        <div className="add_new_row">
                                                            <button type="button" onClick={this.handleAddEmployeeRow}><i className="fas fa-plus"></i>Add Another</button>
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
                                            <button type="button" className="submit" onClick={this.addEmployees}>Submit</button>
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
                <Footer/>
                <Loader show={this.state.showLoader}/>
               </Fragment>
               
        )
    }

   
    
}

