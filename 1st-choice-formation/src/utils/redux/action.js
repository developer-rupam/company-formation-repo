import {ERROR,SUCCESS,SEARCH,EMPLOYEES,CLIENTS} from './constants'

/*** ACTION DEFINATION FOR SET SEARCH QUERY ***/
export const setSearch = (text) => {
    const action = {
        type : SEARCH,
        searchText : text
    }
    return action
}

/*** ACTION DEFINATION FOR EMPLOYEES LIST ***/
export const setEmployeeList = (array) => {
    const action = {
        type : EMPLOYEES,
        employees : array
    }
    return action
}

/*** ACTION DEFINATION FOR CLIENTS LIST ***/
export const setClientList = (array) => {
    const action = {
        type : CLIENTS,
        clients : array
    }
    return action
}


