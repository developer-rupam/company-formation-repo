import { ERROR, SUCCESS,SEARCH } from './constants'


export const searchReducer = (state = {}, action) => {

    switch (action.type) {
        case SEARCH:
            return { searchObj: { ...state, searchQuery : action.searchText } };
        default:
            return state;
    }
}