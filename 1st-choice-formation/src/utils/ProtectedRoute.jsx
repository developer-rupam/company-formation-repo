import React, { Component } from 'react'
import {Route,Redirect} from 'react-router-dom'

export default class ProtectedRoute extends React.Component{
    render(){
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('auth'); //TODO : check with user id from local storage 
       
        return isAuthenticated ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/' }} />
        );
    }
}