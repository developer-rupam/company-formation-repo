import React,{ Fragment } from 'react';

export default class Loader extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.show)
        return (
            <Fragment>
                <div id="WIP_loader" style={{"zIndex":"9999 !important"},{"display":this.props.show ? "block " : "none "}} className="lodr-overlay">
                    <div className="gif-loader">
                    <img src={require('../assets/image/loader.svg')} className="m-b-15" />
                    <p>Please wait...</p>
                    </div>
                </div>
            </Fragment>
        )
    }
}