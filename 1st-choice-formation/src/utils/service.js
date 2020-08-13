import { SITENAMEALIAS,WEBSERVICE } from './init'
import Swal from 'sweetalert2'
const axios = require('axios');

/*** Initializing headers ***/
const headers = {headers: {'Content-Type': 'application/json',}}

/*** function defination for signup ***/
export const signup = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/Signup', payload,headers);
}