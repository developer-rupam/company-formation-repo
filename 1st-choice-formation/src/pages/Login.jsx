import React, { Fragment } from 'react';
import { showToast } from '../utils/library'
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { SITENAMEALIAS } from '../utils/init';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            isRememberMe : false
        };

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.usernameRef = React.createRef();
        this.passwordRef = React.createRef();

        /***  BINDING FUNCTIONS  ***/
        this.handleLogin = this.handleLogin.bind(this)
        this.handleRememberMe = this.handleRememberMe.bind(this)

      
    }

    
      /*** FUNCTION DEFINATION FOR HANDLING LOGIN ***/
      handleLogin = (e) => {
        e.preventDefault();
        if(this.usernameRef.current.value != '' && this.passwordRef.current.value != ''){
            //TODO: set localstorage after API call i.e in callback function
            console.log(this.state.isRememberMe)
            if(this.state.isRememberMe){
                localStorage.setItem(SITENAMEALIAS + '_remember_me','true')
                localStorage.setItem(SITENAMEALIAS + '_credentials',btoa(JSON.stringify({username : this.usernameRef.current.value,password : this.passwordRef.current.value})));
            }else{
                localStorage.setItem(SITENAMEALIAS + '_remember_me','false')
                localStorage.removeItem(SITENAMEALIAS + '_credentials')
            }
        }else{
            showToast('error','Please provide username & password')
        }
    }


    /*** FUNCTION DEFINATION FOR HANDLING REMEMBER ME ***/
    handleRememberMe = () =>{
        
        this.setState({isRememberMe : !this.state.isRememberMe})
    }


    render() {
        return (
               <Fragment>
                 <section className="login_inner">
                    <div className="container">
                        <div className="row justify-content-center align-items-center">
                        <div className="col-md-9">
                            <div className="loginForm shadow">
                                <div className="row">
                                    <div className="col-md-6">
                                    <div className="loginFormLeft">
                                        <h1>Login</h1>
                                        <form onSubmit={this.handleLogin}>
                                            <div className="form-group">
                                                <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Username" ref={this.usernameRef}/>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                                </div>
                                                </div>
                                            </div>
                                            <div className="form-group ">
                                                <div className="input-group">
                                                <input type="password" className="form-control" placeholder="Password" ref={this.passwordRef}/>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                                </div>
                                                </div>
                                            </div>
                                            <div className="rempass">
                                                <div className="remb">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" name="" id="remember"  defaultChecked={this.state.isRememberMe} onClick={this.handleRememberMe}/>
                                                    <label className="custom-control-label" htmlFor="remember">Remember me</label>
                                                </div>
                                                </div>
                                                <div className="foorgot">
                                                <Link to="/">Forgot Password?</Link>
                                                </div>
                                            </div>
                                            <div className="loging_buttom"><button type="submit" className="" >Login</button></div>
                                        </form>
                                    </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="loginFormRight">
                                        <div className="loginFormRight_box">
                                            <img src={require("../assets/image/logo.png")} className="img-fluid"/>
                                            <h2>Welcome ! <br/> 1st Choice Formations</h2>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
                <Loader show={this.state.showLoader}/>
               </Fragment>
               
        )
    }

    componentWillMount(){
        
        /*** INITIALIZING REMEMBER ME VALUE ON BASIS OF VALUE STORED IN LOCAL STORAGE ***/
        let rememberMeStatus = this.state.isRememberMe
        if(localStorage.getItem(SITENAMEALIAS + '_remember_me') == 'true'){
             rememberMeStatus = true
        }else{
             rememberMeStatus = false
        }
        this.setState({isRememberMe : rememberMeStatus});
 
     }
    
}

