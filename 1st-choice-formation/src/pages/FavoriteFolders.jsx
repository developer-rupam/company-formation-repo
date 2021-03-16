import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import { Modal } from 'react-bootstrap';
import { showToast,showConfirm,showHttpError,manipulateRemoveFavoriteEntity } from '../utils/library'
import {CreateDirectory,GetAllSubDirectory,getFavouriteDirectoriesByUser,GetDirectory} from '../utils/service'
import { connect } from 'react-redux';
import Moment from 'react-moment';
import {setFavoriteFoldersList} from '../utils/redux/action'
import { Link,withRouter,browserHistory,matchPath, Redirect  } from 'react-router-dom';

 class FavoriteFolders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            showCreateFolderModal : false,
            showCreateFolderDropDown : false,
            createdBy : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id,
            addPeopleToFolder : false,
            totalCharacterForFolderDetails : 1000,
            foldersList : [],
            selectedEntityInfo: {},
            selectedFolderAssignedTo : [],
            page : 0,
            noOfItemsPerPage : 50,
            totalCount : 0,
            sort : -1,
            totalPageToRender : 0,
            pageButtonArr : []

            
        };
         /***  BINDING FUNCTIONS  ***/
        this.openCreateFolderModal = this.openCreateFolderModal.bind(this)
        this.closeCreateFolderModal = this.closeCreateFolderModal.bind(this)
        this.handleAddPeople = this.handleAddPeople.bind(this)
        this.handleSubmitForCreateFolder = this.handleSubmitForCreateFolder.bind(this)
        this.fetchAllParentDirectory = this.fetchAllParentDirectory.bind(this)
        this.getEntityOwnerDetails = this.getEntityOwnerDetails.bind(this)
        this.handleFolderDetails = this.handleFolderDetails.bind(this)
        this.getFavoriteEntities = this.getFavoriteEntities.bind(this)

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.folderNameRef = React.createRef();
        this.folderDetailsRef = React.createRef();
      
    }

    

    /*** FUNCTION DEFINATION FOR OPENING UPLOAD MODAL ***/
    openCreateFolderModal = () => {
       this.setState({showCreateFolderModal : true})
    }
    /*** FUNCTION DEFINATION FOR CLOSING UPLOAD MODAL ***/
    closeCreateFolderModal = () => {
        this.setState({showCreateFolderModal : false,showCreateFolderDropDown:false})
    }
    /*** FUNCTION DEFINATION FOR OPENING ENTITY INFO MODAL ***/
    openEntityInfoModal = () => {
        this.setState({ showEntityInfoModal: true })
    }
    /*** FUNCTION DEFINATION FOR CLOSING ENTITY INFO MODAL ***/
    closeEntityInfoModal = () => {
        this.setState({ showEntityInfoModal: false, selectedEntityInfo: {},selectedFolderAssignedTo : [] })
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
                    this.setState({showCreateFolderModal : false,showCreateFolderDropDown:false,addPeopleToFolder:false})
                   // this.fetchAllParentDirectory()
                    
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
    let payload = {entity_id : '',page : this.state.page,limit:this.state.noOfItemsPerPage,sort:this.state.sort,searchQuery:this.state.searchQuery}
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
                    
                    this.setState({foldersList : arr,totalCount : response.totalCount })
                    this.props.setFavoriteFoldersList(this.state.foldersList);
                    // console.log(this.state.foldersList)
                //console.log(this.props.globalState)
                this.handlePaginationLogic();
                    
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
    this.props.history.push('/folder-details/'+param+'/personal_folder')
    }  

    /**** FUNCTION DEFINATION TO GET FAVORITE ENTITY LIST ****/
    getFavoriteEntities = () => {
        let payload = {'user_id' : JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id}
        this.setState({showLoader : true})
        console.log(payload)
        getFavouriteDirectoriesByUser(payload).then(function(res){
            var response = res.data;
            if(response.errorResponse.errorStatusCode != 1000){
                this.setState({showLoader : false})
                showToast('error',response.errorResponse.errorStatusType);
            }else{
                let arr = [];
                    let folders = response.response.favourite_entity
                    for(let i=0;i<folders.length;i++){
                          
                        arr.push(folders[i]);
                    }
                    this.setState({foldersList : arr,showLoader : false})
                this.props.setFavoriteFoldersList(response.response.favourite_entity)
               
            }
         }.bind(this)).catch(function(err){
            this.setState({showLoader : false})
            showHttpError(err)
        }.bind(this))
    }

    /***  Function defination for handling file folder information ****/
    getFileFolderInfo = (param) => {

        /* Entity Size */
        let id = param.entity_id
        let name = param.entity_name
        let location = param.entity_location
        this.showLoader = true;
        let payload = {directoryName : name}
        GetDirectory(payload).then(function (res) {
            let response = res.data.response;
            if(response !== null){
                let size = response.folderSize;
                this.setState({ showLoader : false,selectedEntityInfo: { size: size, name: name, id: id } }, () => {
                    this.openEntityInfoModal();
                });
            }
        }.bind(this)).catch(function (err) {
            this.setState({ showLoader: false })
            showHttpError(err)
        }.bind(this))

        /* Entity Assignee */
        let nameArr = [];
        let clients = this.props.globalState.clientListReducer.clientsList
        if(param.asigned_user_ids.length !== 0 && clients.length !== 0){
            for(let i=0;i<param.asigned_user_ids.length;i++){
                let id = param.asigned_user_ids[i];
                for(let j=0;j<clients.length;j++){
                    if(id === clients[j].user_id){
                        console.log('here')
                        nameArr.push(clients[j].user_name) ;
                    }
                }
               
            }
        }
        this.setState({ selectedFolderAssignedTo : nameArr});


    }
    /*** Method defination for handling folder sorting ***/
    handleFolderSorting = (param) => {
        this.setState({sort : param},()=>{
            this.fetchAllParentDirectory();
        })
    }
    /* method defination for handling pagination logic */
    handlePaginationLogic = () =>{
        /* logic for pagination page button rendering */
        let totalPageToRender = Math.ceil(this.state.totalCount/this.state.noOfItemsPerPage)
        let pageButtonArr = [];
        let start = 0
        for(let i=start;i<totalPageToRender;i++){
            pageButtonArr.push(i)
        }
        this.setState({
            totalPageToRender : totalPageToRender,
            pageButtonArr : pageButtonArr
        },()=>{
            console.log(this.state.totalPageToRender,this.state.page)
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
                                            <div className="lft-hdr"><span><i className="fas fa-folder-open"></i></span>Favorite Folders</div>
                                            {/* <div className="addbutton">
                                                <span className={this.state.showCreateFolderDropDown ? "addbutton_click cross" : "addbutton_click"} onClick={()=>{this.setState({showCreateFolderDropDown : !this.state.showCreateFolderDropDown})}}><i className="fas fa-plus"></i></span>
                                                <div className={this.state.showCreateFolderDropDown ? "drop_menu view_drop" : "drop_menu"}>
                                                <button type="button" data-toggle="modal" data-target="#creatfolderModal" onClick={this.openCreateFolderModal}><i className="fas fa-folder-open"></i>Create Folder</button>
                                                </div>
                                            </div> */}
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
                                                    <th>Details</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.foldersList.map((list) =>
                                                <tr className="pointer-cursor" key={list.entity_id}>
                                                    <td><span className="select" style={{color:'#f5941f'}}  onClick={()=>{manipulateRemoveFavoriteEntity(this.state.createdBy,list.entity_id,() => {
                                                                this.getFavoriteEntities()
                                                                })}}><i className="far fa-star"></i></span><span className="foldericon"><i className={list.is_directory ? "fas fa-folder-open" : "fas fa-file-pdf"}></i></span><a href="#!">{list.entity_name}</a><span className="ml-2" onClick={() => { this.getFileFolderInfo(list) }}><i className="fas fa-info-circle"></i></span></td>
                                                    
                                                    <td>
                                                        <Moment format="YYYY/MM/DD HH:mm:ss" date={list.entity_created}/>
                                                    </td>
                                                    <td>{this.getEntityOwnerDetails(list.directory_owner).ownerName}</td>
                                                    <td>{list.is_directory ? <button className="btn btn-primary"  onClick={()=>{this.handleFolderDetails(list.entity_id)}}> <i className="fas fa-eye"></i>  Details</button> : <a href={list.entity_location} className="btn btn-warning"> <i className="fas fa-eye"></i> Show</a>}</td>
                                                </tr>)}
                                                
                                                </tbody>
                                            </table>
                                            {this.state.totalCount >= 0 && <nav aria-label="Page navigation example">
                                                        <ul className="pagination justify-content-center">
                                                            {this.state.page > 0 && <li className="page-item">
                                                                <a className="page-link" href="javascript:void(0)" tabindex="-1" onClick={(e)=>{
                                                                    this.setState({
                                                                        page : this.state.page - 1
                                                                    },()=>{
                                                                        this.fetchAllParentDirectory();
                                                                    })
                                                                }}>Previous</a>
                                                            </li>}
                                                            {this.state.pageButtonArr.map((pagi)=><li className="page-item" key={pagi}><a className="page-link" href="javascript:void(0)" onClick={(e)=>{
                                                                this.setState({page : pagi},()=>{
                                                                    this.fetchAllParentDirectory();
                                                                })
                                                            }}>{pagi + 1}</a></li>)}
                                                            { this.state.totalPageToRender > this.state.page + 1 && <li className="page-item">
                                                                <a className="page-link" href="javascript:void(0)" onClick={(e)=>{
                                                                    this.setState({
                                                                        page : this.state.page + 1
                                                                    },()=>{
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
                    </Modal.Body>

                </Modal>
                <Footer/>
                <Loader show={this.state.showLoader}/>
               </Fragment>
               
        )
    }
    componentDidMount(){
       /*** FETCH FAVORITE FOLDER LIST IF FAVORITE LIST IS NOT AVAILABLE ***/
        this.getFavoriteEntities();
       
   }
   
    
}
const mapStateToProps = state => {
    return {
        globalState : state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setFavoriteFoldersList : (array) => dispatch(setFavoriteFoldersList(array)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(FavoriteFolders))

