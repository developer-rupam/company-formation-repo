import {ERROR,SUCCESS,SEARCH} from './constants'


export const setSearch = (text) => {
    const action = {
        type : SEARCH,
        searchText : text
    }
    return action
}


