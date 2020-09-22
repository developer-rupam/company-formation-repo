import {SHAREDFOLDERS,PERSONALFOLDERS,FAVORITEFOLDERS,SEARCH,EMPLOYEES,CLIENTS} from './constants'

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

/*** ACTION DEFINATION FOR PERSONAL FOLDERS ***/
export const setPersonalFoldersList = (array) => {
    const action = {
        type : PERSONALFOLDERS,
        list : array
    }
    return action
}

/*** ACTION DEFINATION FOR SHARED FOLDERS ***/
export const setSharedFoldersList = (array) => {
    const action = {
        type : SHAREDFOLDERS,
        list : array
    }
    return action
}

/*** ACTION DEFINATION FOR FAVORITE FOLDERS ***/
export const setFavoriteFoldersList = (array) => {
    const action = {
        type : FAVORITEFOLDERS,
        list : array
    }
    return action
}


