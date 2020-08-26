import { SITENAMEALIAS,WEBSERVICE } from './init'
import Swal from 'sweetalert2'
const axios = require('axios');

/*** Initializing headers ***/
const headers = {headers: {'Content-Type': 'application/json',}}



/*** FUNCTION DEFINATION FOR LOGIN SERVICE ***/
export const login = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/login_user', payload,headers);

}

/*** FUNCTION DEFINATION FOR GET ALL CLIENT LIST SERVICE ***/
export const GetAllClientList = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/get_all_user', payload,headers);

}