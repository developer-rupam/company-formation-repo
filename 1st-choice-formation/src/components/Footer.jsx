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
                    <a href="https://1st-choice-formation.smart-doc.co.uk/extra/terms.html" target="_blank">Term and Conditions</a>
                    <a href="https://1st-choice-formation.smart-doc.co.uk/extra/privacy.html" target="_blank">GDPR Privacy Policy</a>
                </div>
            </footer>
            </Fragment>
        )
    }
    
}

export default Footer;