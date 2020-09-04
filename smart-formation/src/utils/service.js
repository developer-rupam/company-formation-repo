import { SITENAMEALIAS,WEBSERVICE } from './init'
import Swal from 'sweetalert2'
const axios = require('axios');

/*** Initializing headers ***/
const headers = {headers: {'Content-Type': 'application/json',}}



/*** FUNCTION DEFINATION FOR LOGIN SERVICE ***/
export const LoginUser = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/login_user', payload,headers);

}

/*** FUNCTION DEFINATION FOR GET ALL CLIENT LIST SERVICE ***/
export const GetAllUser = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/get_all_user', payload,headers);

}
/*** FUNCTION DEFINATION FOR GET ALL EMPLOYEE LIST SERVICE ***/
export const GetAllEmployee = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/employee/get_all_employee', payload,headers);

}

/*** FUNCTION DEFINATION FOR CREATE USER ****/
export const CreateUser = (arr) => {
    var payload = JSON.stringify(arr);

    return axios.post(WEBSERVICE + '/user/create_user', payload,headers);
}

/*** FUNCTION DEFINATION FOR CREATE EMPLOYEE ****/
export const CreateEmployeeService = (arr) => {
    var payload = JSON.stringify(arr);

    return axios.post(WEBSERVICE + '/employee/create_employee', payload,headers);
}