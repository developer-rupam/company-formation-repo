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

/*** FUNCTION DEFINATION FOR CREATE USER ****/
export const UpdateUser = (obj) => {
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/update_user', payload,headers);
}

/**** FUNCTION defination for updating employee ****/
export const UpdateEmployeeService = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/employee/update_employee', payload,headers);
}

/**** FUNCTION DEFINATION FOR DELETE CLIENT ****/
export const RemoveUser = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/remove_user', payload,headers);
}
/**** FUNCTION DEFINATION FOR DELETE EMPLOYEE ****/
export const RemoveEmployee = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/employee/remove_employee', payload,headers);
}

/*** FUNCTION DEFINATION TO GET CLIENT & ADMIN DETIALS ***/
export const GetUserDetails = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/get_user_details', payload,headers);
}

/*** FUNCTION DEFINATION TO GET EMPLOEE DETIALS ***/
export const GetEmployeeDetails = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/employee/get_employee_details', payload,headers);
}

/*** FUNCTION DEFINATION TO Create Directory ***/
export const CreateDirectory = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/directory/create_directory', payload,headers);
}

/*** FUNCTION DEFINATION TO GET ALL SUB Directory & Files By DIRECTORY ***/
export const GetAllSubDirectory = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/directory/get_all_sub_directory', payload,headers);
}

/*** FUNCTION DEFINATION TO GET ALL SUB Directory & Files By DIRECTORY ***/
export const CreateFile = (payload) =>{

    return axios.post(WEBSERVICE + '/directory/create_file', payload, {'Content-Type': 'multipart/form-data' });
}

/*** FUNCTION DEFINATION FOR ASSIGNING USER WITH ENTITY ***/
export const addDirectoryAssignedUser = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/directory/add_directory_asigned_user', payload,headers);
} 

/*** FUNCTION DEFINATION FOR SHARE USER WITH ENTITY ***/
export const addDirectorySharedUser = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/directory/add_directory_shared_user', payload,headers);
} 

/*** FUNCTION DEFINATION FOR MAKING ENTITY FAVORITE ***/
export const addUserFavouriteDirectory = (obj) =>{
    var payload = JSON.stringify(obj);

    return axios.post(WEBSERVICE + '/user/add_user_favourite_directory', payload,headers);
} 

/*** FUNCTION DEFINATION FOR DELETING ENTITY ***/
export const removeDirectory = (obj) => {
    var payload = JSON.stringify(obj);
    return axios.post(WEBSERVICE + '/directory/remove_directory', payload,headers);
}