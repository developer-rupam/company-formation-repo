import React, { Component } from 'react'
import {Route,Redirect} from 'react-router-dom'
import {SITENAMEALIAS,BASEURL} from '../utils/init'

export default class ProtectedRoute extends React.Component{
    render(){
        const Component = this.props.component;
        const session = localStorage.getItem(SITENAMEALIAS + '_session');
        const isAuthenticated = session;
       
        return isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/' }} />
        );
    }
}