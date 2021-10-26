import React, { Fragment } from 'react';
import { showToast, showHttpError } from '../utils/library'
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { SITENAMEALIAS, SITENAME } from '../utils/init';
import { SentOtpForLogin,VerifyOtpForLogin } from '../utils/service'
import Swal from 'sweetalert2'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            email: '',
        };

        /*** REFERENCE FOR RETRIEVING INPUT FIELDS DATA ***/
        this.otpRef = React.createRef();

        /***  BINDING FUNCTIONS  ***/
        this.handleOtp = this.handleOtp.bind(this)
        this.handleResendOtp = this.handleResendOtp.bind(this)


    }
        /** Function defination for resend otp **/
        handleResendOtp = () =>{
            this.setState({ showLoader: true })
           
            let obj = {
                "user_email": this.state.email,
                "action": "login"
            }
            SentOtpForLogin(obj).then(function (res) {
                this.setState({ showLoader: false })
                var response = res.data;
                if (response.errorResponse.errorStatusCode != 1000) {
                    showToast('error', response.errorResponse.errorStatusType);
                } else {
                   
                    showToast('error', 'Verification code send successfully');
                }
            }.bind(this)).catch(function (err) {
                this.setState({ showLoader: false })
                showHttpError(err, this.props)
            }.bind(this))
        }

    /*** FUNCTION DEFINATION FOR HANDLING LOGIN ***/
    handleOtp = (e) => {
        e.preventDefault();
        if (this.otpRef.current.value != '') {
            let payload = {
                otp: this.otpRef.current.value,
                user_email:this.state.email,
                action:'login'

            }
            this.setState({ showLoader: true })
             VerifyOtpForLogin(payload).then(function(res){
               this.setState({showLoader : false})
               var response = res.data;
               if(response.errorResponse.errorStatusCode != 1000){
                   showToast('error',response.errorResponse.errorStatusType);
               }else{
                Swal.fire({
                    icon: 'success',
                    title: 'You are now logged in',
                    showConfirmButton: false,
                    timer: 2000
                  })
                   this.props.history.push('/dashboard')
              }
            }.bind(this)).catch(function(err){
               this.setState({showLoader : false})
               showHttpError(err,this.props)
           }.bind(this)) 


        } else {
            showToast('error', 'Please provide OTP')
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
                                            <h4 className="text-center mb-2">Check your e-mail !!!</h4>
                                                <div style={{background: '#9ccb9c',marginBottom: '20px',textAlign: 'center',padding: '14px',borderRadius: '7px'}}>
                                                    <span className="text-center">We've sent a 6-digit verification code to your email-<b>{this.state.email}</b></span><br/><span> Please enter the code to login</span>
                                                </div>    
                                                <form onSubmit={(event) => { this.handleOtp(event) }}>

                                                    <div className="form-group ">
                                                        <div className="input-group">
                                                            <input type="password" className="form-control" placeholder="Enter Verification Code" ref={this.otpRef} />
                                                            {/* <div className="input-group-prepend">
                                                                <span className="input-group-text"><i className="fas fa-key"></i></span>
                                                            </div> */}
                                                            
                                                        </div>
                                                        <span style={{cursor:'pointer',marginLeft:'244px'}} onClick={this.handleResendOtp}>Resend OTP</span>
                                                    </div>

                                                    <div className="loging_buttom"><button type="submit" className="" >Submit</button></div>
                                                </form>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="loginFormRight">
                                                <div className="loginFormRight_box">
                                                    <img src={require("../assets/image/logo.png")} className="img-fluid" />
                                                    <h2>Welcome ! <br /> {SITENAME}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Loader show={this.state.showLoader} />
            </Fragment>

        )
    }

    componentWillMount() {

        let session = JSON.parse(atob(localStorage.getItem(SITENAMEALIAS + '_session')))
        let email = '';
        if (session.user_role != 'EMPLOYEE') {
            email = atob(session.user_email);
        } else {
            email = atob(session.employee_email);
        }
        this.setState({ email : email})
    }

}

