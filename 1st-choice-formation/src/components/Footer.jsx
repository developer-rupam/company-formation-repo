import React, { Fragment } from 'react';
import { Link,NavLink } from 'react-router-dom';


 class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

        
    }


    

   


    render() {
        return (
            <Fragment>
               <footer className="app-footer log_foot">
                <div>
                    <Link to="/dashboard">Smart Docustore Ltd</Link>
                    <span>© 2021 .</span>
                </div>
                <div className="termbox">
                    <Link to="/dashboard">Term and Conditions</Link>
                    <Link to="/dashboard">GDPR Privacy Policy</Link>
                </div>
            </footer>
            </Fragment>
        )
    }
    
}

export default Footer;