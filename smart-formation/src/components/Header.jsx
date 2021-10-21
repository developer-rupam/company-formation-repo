import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { SITENAME, SITENAMEALIAS, BASEURL } from '../utils/init';
import { storeCurrentRoute, logout, showToast, showHttpError } from '../utils/library';
import { GlobalSearch } from '../utils/service';
import { withRouter } from 'react-router-dom';
import { setSearch } from "../utils/redux/action"
import { connect } from 'react-redux';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            searchList: [],
            showClearSearchButton: false
        }

        /*** REFERENCE FOR INPUT DATA FIELD ***/
        this.searchFieldRef = React.createRef();

        /***  BIND FUNCTIONS ***/
        this.toggleSidebar = this.toggleSidebar.bind(this)
        this.logout = this.logout.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }

    /*** FUNCTION DEFINATION FOR TOGGLING SIDEBAR ***/
    toggleSidebar = () => {
        let element = document.querySelector('.app')
        if (element.classList.contains('sidebar-lg-show')) {
            element.classList.remove('sidebar-lg-show')
            element.classList.remove('sidebar-show')
        } else {
            element.classList.add('sidebar-lg-show')
            element.classList.add('sidebar-show')
        }
    }


    /*** FUNCTION DEFINATION FOR LOGOUT ***/
    logout = () => {
        localStorage.removeItem(SITENAMEALIAS + '_session');
        this.props.history.push('/')
    }

    handleSearchSubmit = (e) => {
        e.preventDefault();
        if (this.searchFieldRef.current.value != '') {
            this.setState({ showLoader: true, showClearSearchButton: false })
            let loggedInUserRole = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_role;
            let loggedInUserId = atob(JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session'))).user_id);
            let payload = { searchQuery: this.searchFieldRef.current.value }
            GlobalSearch(payload).then(function (res) {
                var response = res.data;
                if (response.errorResponse.errorStatusCode != 1000) {
                    this.setState({ showLoader: false })
                    showToast('error', response.errorResponse.errorStatusType);
                } else {
                    let arr = [];
                    if (response.response.user != undefined) {
                        let user = response.response.user
                        for (let i = 0; i < user.length; i++) {
                            if (loggedInUserRole == 'ADMIN') {
                                arr.push(user[i]);
                            } else {

                            }
                        }
                    }
                    if (response.response.directory != undefined) {
                        let entity = response.response.directory
                        for (let i = 0; i < entity.length; i++) {

                            if (loggedInUserRole == 'ADMIN') {
                                arr.push(entity[i]);
                            } else {
                                if(entity[i].asigned_user_ids.includes(loggedInUserId)){
                                    arr.push(entity[i]); 
                                }
                            }
                        }
                    }
                    this.setState({ searchList: arr, showLoader: false, showClearSearchButton: true }, () => {
                        console.log(this.state.searchList)
                    })
                }
            }.bind(this)).catch(function (err) {
                this.setState({ showLoader: false })
                  showHttpError(err,this.props)
            }.bind(this))
        }
    }
    /* Method defination for validating serch field */
    validateSearchField = (e) => {
        let searchVal = this.searchFieldRef.current.value
        if (searchVal == '') {
            this.setState({ searchList: [], showClearSearchButton: false })
        } else {
            this.setState({ showClearSearchButton: true })
        }
    }


    render() {
        return (
            <Fragment>
                <header className="app-header navbar">
                    <button className="navbar-toggler sidebar-toggler d-lg-none mr-auto" type="button" data-toggle="sidebar-show">
                        <span className="navbar-toggler-icon" onClick={this.toggleSidebar} data-toggle="sidebar-lg-show"></span>
                    </button>
                    <Link className="navbar-brand" to="/dashboard">
                        <img className="navbar-brand-full img-fluid" src={require('../assets/image/logo.png')} alt="Logo" />
                        <img className="navbar-brand-minimized" src={require('../assets/image/sm_logo.png')} alt="Logo" />
                    </Link>
                    <button className="navbar-toggler sidebar-toggler d-md-down-none" type="button" onClick={this.toggleSidebar} data-toggle="sidebar-lg-show">
                        <i className="fas fa-bars"></i>
                    </button>
                    <ul className="nav navbar-nav d-md-down-none">
                        <li className="nav-item px-3">
                            <Link className="nav-link" to="/dashboard"><i className="nav-icon fas fa-home mr-1" style={{ marginTop: '2.1px' }}></i>Dashboard</Link>
                        </li>
                    </ul>
                    <ul className="nav navbar-nav ml-auto top_menu">
                        <li className="nav-item">
                            <div className="searchheader">
                                <form onSubmit={this.handleSearchSubmit}>
                                    <input type="text" placeholder="Search" className="form-control" ref={this.searchFieldRef} onKeyUp={this.validateSearchField} />
                                    {this.state.searchList.length > 0 && <div className="autocomplete-items">
                                        {this.state.searchList.map((list) =>
                                            <div>
                                                {list.user_name != undefined ? <Link to={'/update-client/' + atob(list.user_id)}><i className="fas fa-user"></i>{list.user_name}({list.user_email})</Link> : <Link to={'/folder-details/' + list.entity_id + '/shared_folder'}><i className="fas fa-folder"></i>{list.entity_name}</Link>}
                                            </div>
                                        )}

                                    </div>}
                                    {!this.state.showClearSearchButton ? <button type="submit"><i className="fas fa-search"></i></button> : <button type="button" onClick={() => {
                                        this.setState({ searchList: [], showClearSearchButton: false });
                                        this.searchFieldRef.current.value = '';
                                    }}><i className="fas fa-times"></i></button>}
                                </form>
                            </div>
                        </li>
                       {/*  <li className="nav-item">
                            <Link className="nav-link" to={BASEURL}><i className="nav-icon fas fa-question-circle mr-1" style={{ marginTop: '2.1px' }}></i>Help</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={BASEURL}><i className="nav-icon fas fa-rocket mr-1" style={{ marginTop: '2.1px' }}></i>Apps</Link>
                        </li> */}
                        <li className="nav-item">
                            <Link className="nav-link" onClick={this.logout}><i className="nav-icon fas fa-sign-out-alt mr-1" style={{ marginTop: '2.1px' }}></i>Logout</Link>
                        </li>
                    </ul>
                </header>
            </Fragment>
        )
    }
    componentDidMount() {
        /*** calling function for storing current route ***/
        storeCurrentRoute(this.props.location.pathname)

    }
}

const mapDispatchToProps = dispatch => {
    return {
        setSearch: (text) => dispatch(setSearch(text)),
    }
}


export default connect(null, mapDispatchToProps)(withRouter(Header))