import React, { Fragment } from 'react';
import { showToast,showHttpError } from '../utils/library'
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { SITENAMEALIAS,SITENAME } from '../utils/init';
import {ChangePassword,VerifyOtp,SendOtp} from '../utils/service'

export default class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader : false,
            isOtpSend : false,
            isOtpVerified : false,
            isAbleToChangePassword : false,
            isPasswordMatched : false,
            isEmailDisabled : false
        };

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.otpRef = React.createRef();

        
      
    }

    /* Method defination for generating otp */
    handleGenerateOtp = () => {
        if(this.emailRef.current.value != ''){
            
            this.setState({showLoader : true})
            let payload = {user_email : this.emailRef.current.value}
            SendOtp(payload).then(function(res){
                this.setState({showLoader : false})
                var response = res.data;
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    this.setState({isOtpSend : true,isEmailDisabled : true})
               }
             }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err)
            }.bind(this))
        }else{
            showToast('error','Please proivide email');
        }
    } 

    /* Method defination for verifing otp */
    handleVerifyOtp = () => {
        if(this.otpRef.current.value != ''){
           
            this.setState({showLoader : true})
            let payload = {user_email : this.emailRef.current.value,otp : this.otpRef.current.value}
            VerifyOtp(payload).then(function(res){
                this.setState({showLoader : false})
                var response = res.data;
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    this.setState({isOtpVerified : true,isEmailDisabled : true})
               }
             }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err)
            }.bind(this))
        }else{
            showToast('error','Please proivide otp');
        }
    }
    /* Method defination for verifing otp */
    handleChangePassword = () => {
       if(this.state.isAbleToChangePassword){
        this.setState({showLoader : true})
            let payload = {user_email : this.emailRef.current.value,user_password : this.passwordRef.current.value}
            ChangePassword(payload).then(function(res){
                this.setState({showLoader : false})
                var response = res.data;
                if(response.errorResponse.errorStatusCode != 1000){
                    showToast('error',response.errorResponse.errorStatusType);
                }else{
                    showToast('success','Password Changed successfully, please login to continue ');
                    this.props.history.push('/dashboard')
               }
             }.bind(this)).catch(function(err){
                this.setState({showLoader : false})
                showHttpError(err)
            }.bind(this))
       }
    }
     
    /* Method defination for checking password */
    handleCheckPassword = () => {
        if(this.passwordRef.current.value != '' && this.confirmPasswordRef.current.value != ''){
            if(this.passwordRef.current.value === this.confirmPasswordRef.current.value){
                this.setState({isPasswordMatched : true,isAbleToChangePassword:true})
            }else{
                this.setState({isPasswordMatched : false,isAbleToChangePassword:false})
            }
        }
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
                                        <h1>Forgot Password</h1>
                                        <form >
                                            <div className="form-group">
                                                <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Email" ref={this.emailRef} disabled={this.state.isEmailDisabled}/>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                                </div>
                                                </div>
                                            </div>
                                            {this.state.isOtpSend && !this.state.isOtpVerified && <div className="form-group">
                                                <div className="input-group">
                                                <input type="text" className="form-control" placeholder="OTP" ref={this.otpRef} />
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fas fa-passport"></i></span>
                                                </div>
                                                </div>
                                            </div>}
                                            {this.state.isOtpVerified && <div className="form-group ">
                                                <div className="input-group">
                                                <input type="password" className="form-control" placeholder="New Password" ref={this.passwordRef} onKeyUp={this.handleCheckPassword} />
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fas fa-key"></i></span>
                                                </div>
                                                </div>
                                            </div>}
                                            {this.state.isOtpVerified && <div className="form-group ">
                                                <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Confirm Password" ref={this.confirmPasswordRef}  onKeyUp={this.handleCheckPassword}/>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text"><i className="fas fa-horse-head"></i></span>
                                                </div>
                                                </div>
                                            </div>}
                                            {this.state.isOtpVerified && <div className="text-center mb-2">
                                                {this.state.isPasswordMatched && <span style={{color:'green'}}><i className="far fa-check-circle"></i> Password matched</span>}
                                                {!this.state.isPasswordMatched && <span style={{color:'red'}}><i class="far fa-times-circle"></i> Password mismatched</span>}
                                            </div>}
                                           {/*  <div className="rempass">
                                                <div className="remb">
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" name="" id="remember"  defaultChecked={this.state.isRememberMe} onClick={this.handleRememberMe}/>
                                                    <label className="custom-control-label" htmlFor="remember">Remember me</label>
                                                </div>
                                                </div>
                                                <div className="foorgot">
                                                <Link to="/forgot-password">Forgot Password?</Link>
                                                </div>
                                            </div> */}
                                            {!this.state.isOtpSend && !this.state.isOtpVerified && !this.state.isAbleToChangePassword && <div className="loging_buttom"><button type="button" className="" onClick={this.handleGenerateOtp}>Send OTP</button></div>}
                                            {this.state.isOtpSend && !this.state.isOtpVerified && !this.state.isAbleToChangePassword &&<div className="loging_buttom"><button type="button" className="" onClick={this.handleVerifyOtp}>Verify OTP</button></div>}
                                            {this.state.isOtpSend && this.state.isOtpVerified &&<div className="loging_buttom"><button type="button" className="" disabled={!this.state.isAbleToChangePassword } onClick={this.handleChangePassword}>Change Password</button></div>}
                                        </form>
                                    </div>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="loginFormRight">
                                        <div className="loginFormRight_box">
                                            <img src={require("../assets/image/logo.png")} className="img-fluid"/>
                                            <h2>Welcome ! <br/> {SITENAME}</h2>
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
        
        
 
     }
    
}

