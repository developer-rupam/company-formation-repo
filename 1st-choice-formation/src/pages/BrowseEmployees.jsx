import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

 class BrowseEmployees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            selectedAlphabetOfClient : "",
            activePage : 1,
            pageNo : 1,
            noOfItemsPerPage : 10,
            totalCount : 100,
        };
         /***  BINDING FUNCTIONS  ***/
         this.selectClientNameAlphabet = this.selectClientNameAlphabet.bind(this)
         this.handlePageChange = this.handlePageChange.bind(this)

      
    }

    /*** FUNCTION DEFINATION FOR SELECTING ALPHABET OF CLIENTS NAME ***/
    selectClientNameAlphabet = (e) => {
        this.setState({selectedAlphabetOfClient : e.target.value})
        setTimeout(function(){
            console.log(this.state.selectedAlphabetOfClient)
            //TODO:Call Api to render list on basis of alphabet selected
        }.bind(this),1000)
    }

    /*** FUNCTION DEFINATION FOR SELECTING PAGE FROM PAGINATION ***/
    handlePageChange = (page) =>{
        this.setState({
            activePage : page
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
                                            <div className="lft-hdr"><span><i className="fas fa-users"></i></span>Browse Employees</div>
                                            <div className="addbutton">
                                                <div className="serach_box_bylte">
                                                <form>
                                                    <label>Search By Letter</label>
                                                   
                                                       <select className=" form-control" onChange={this.selectClientNameAlphabet}>
                                                        <option value="">ALL</option>
                                                        <option value="a">A</option>
                                                        <option value="b">B</option>
                                                        <option value="c">C</option>
                                                        <option value="d">D</option>
                                                        <option value="e">E</option>
                                                        <option value="f">F</option>
                                                        <option value="g">G</option>
                                                        <option value="h">H</option>
                                                        <option value="i">I</option>
                                                        <option value="j">J</option>
                                                        <option value="k">K</option>
                                                        <option value="l">L</option>
                                                        <option value="m">M</option>
                                                        <option value="n">N</option>
                                                        <option value="o">O</option>
                                                        <option value="p">P</option>
                                                        <option value="q">Q</option>
                                                        <option value="r">R</option>
                                                        <option value="s">S</option>
                                                        <option value="t">T</option>
                                                        <option value="u">U</option>
                                                        <option value="v">V</option>
                                                        <option value="w">W</option>
                                                        <option value="x">X</option>
                                                        <option value="y">Y</option>
                                                        <option value="z">Z</option>
                                                       </select>
                                                </form>
                                                </div>
                                                <button type="submit" className="deleteclient"><i className="fas fa-user-minus"></i>Delete Selected Employee</button>
                                                <Link to="/create-employee" className="addclient"><i className="fas fa-user-plus"></i>Create Employee</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body custom_card_body_browesclient">
                                        <div className="dash_lft_t">
                                            <table className="table table-striped table-bordered dt-responsive text-center">
                                                <thead>
                                                <tr>
                                                    <th>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input" id="check_all"/>
                                                            <label className="custom-control-label" htmlFor="check_all"></label>
                                                        </div>
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Company</th>
                                                    <th>Last Login</th>
                                                    <th>Manage</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input checkbox" id="customCheck1"/>
                                                            <label className="custom-control-label" htmlFor="customCheck1"></label>
                                                        </div>
                                                    </td>
                                                    <td>Client Name</td>
                                                    <td>email@gmail.com</td>
                                                    <td>Company</td>
                                                    <td>12/08/2020</td>
                                                    <td>
                                                        <div className="ac_bot d-flex justify-content-center">
                                                            <a href="#" className="btn btn-light view_edit"><i className="fas fa-user-edit"></i></a>
                                                            <a href="#" className="btn btn-light view_dlt"><i className="fas fa-user-minus"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input checkbox" id="customCheck2"/>
                                                            <label className="custom-control-label" htmlFor="customCheck2"></label>
                                                        </div>
                                                    </td>
                                                    <td>Client Name</td>
                                                    <td>email@gmail.com</td>
                                                    <td>Company</td>
                                                    <td>12/08/2020</td>
                                                    <td>
                                                        <div className="ac_bot d-flex justify-content-center">
                                                            <a href="#" className="btn btn-light view_edit"><i className="fas fa-user-edit"></i></a>
                                                            <a href="#" className="btn btn-light view_dlt"><i className="fas fa-user-minus"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input checkbox" id="customCheck3"/>
                                                            <label className="custom-control-label" htmlFor="customCheck3"></label>
                                                        </div>
                                                    </td>
                                                    <td>Client Name</td>
                                                    <td>email@gmail.com</td>
                                                    <td>Company</td>
                                                    <td>12/08/2020</td>
                                                    <td>
                                                        <div className="ac_bot d-flex justify-content-center">
                                                            <a href="#" className="btn btn-light view_edit"><i className="fas fa-user-edit"></i></a>
                                                            <a href="#" className="btn btn-light view_dlt"><i className="fas fa-user-minus"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input checkbox" id="customCheck4"/>
                                                            <label className="custom-control-label" htmlFor="customCheck4"></label>
                                                        </div>
                                                    </td>
                                                    <td>Client Name</td>
                                                    <td>email@gmail.com</td>
                                                    <td>Company</td>
                                                    <td>12/08/2020</td>
                                                    <td>
                                                        <div className="ac_bot d-flex justify-content-center">
                                                            <a href="#" className="btn btn-light view_edit"><i className="fas fa-user-edit"></i></a>
                                                            <a href="#" className="btn btn-light view_dlt"><i className="fas fa-user-minus"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="custom-control custom-checkbox">
                                                            <input type="checkbox" className="custom-control-input checkbox" id="customCheck5"/>
                                                            <label className="custom-control-label" htmlFor="customCheck5"></label>
                                                        </div>
                                                    </td>
                                                    <td>Client Name</td>
                                                    <td>email@gmail.com</td>
                                                    <td>Company</td>
                                                    <td>12/08/2020</td>
                                                    <td>
                                                        <div className="ac_bot d-flex justify-content-center">
                                                            <a href="#" className="btn btn-light view_edit"><i className="fas fa-user-edit"></i></a>
                                                            <a href="#" className="btn btn-light view_dlt"><i className="fas fa-user-minus"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div className="row">
                                                <div className="col-md-8"></div>
                                                <div className="col-md-4 float-right">
                                                <Pagination
                                                    activePage={this.state.activePage}
                                                    itemsCountPerPage={this.state.noOfItemsPerPage}
                                                    totalItemsCount={this.state.totalCount}
                                                    pageRangeDisplayed={5}
                                                    onChange={this.handlePageChange.bind(this)}
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                />
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
        
    }

    componentWillReceiveProps(){
        setTimeout(() => {
            
            console.log(this.props)
        }, 1000);
    }
    
}

const mapStateToProps = state => {
    return {
        globalState : state
    }
}

export default connect(mapStateToProps,null)(BrowseEmployees)
