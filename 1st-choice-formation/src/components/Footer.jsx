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
                    <Link to="/dashboard">1st Choice Formations</Link>
                    <span>© 2020 .</span>
                </div>
                <div className="termbox">
                    <Link to="/dashboard">Term and Conditions</Link>
                    <Link to="/dashboard">Privacy Policy</Link>
                </div>
            </footer>
            </Fragment>
        )
    }
    
}

export default Footer;