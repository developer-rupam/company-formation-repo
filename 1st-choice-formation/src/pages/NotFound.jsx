import React, { Fragment } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';


export default class NotFound extends React.Component {
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
                                <div className="col-md-12 col-md-offset-8 text center" style={{margin:'0 auto'}}>
                                    <h1>404</h1>
                                    <h3>Ops, page not found </h3>
                                </div>
                                
                                
                            </div>
                        </div>
                        </div>
                    </main> 
                </div>
                <Footer/>
               </Fragment>
               
        )
    }

    
}

