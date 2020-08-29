import { ERROR, SUCCESS,SEARCH,EMPLOYEES,CLIENTS } from './constants'

/*** REDUCER DEFINATION FOR SEARCH IN HEADER SECTION ***/
export const searchReducer = (state = {}, action) => {

    switch (action.type) {
        case SEARCH:
            return { searchObj: { ...state, searchQuery : action.searchText } };
        default:
            return state;
    }
}

/*** REDUCER DEFINATION FOR EMPLOYEE LIST ***/
export const employeeListReducer = (state = {}, action) => {

    switch (action.type) {
        case EMPLOYEES:
            return  { ...state, employeesList : action.employees } ;
        default:
            return state;
    }
}

/*** REDUCER DEFINATION FOR CLIENT LIST ***/
export const clientListReducer = (state = {}, action) => {

    switch (action.type) {
        case CLIENTS:
            return { ...state, clientsList : action.clients } ;
        default:
            return state;
    }
}