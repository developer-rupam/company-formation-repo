import { createStore, combineReducers } from 'redux'
import { searchReducer,employeeListReducer,clientListReducer,personalFoldersReducer,sharedFoldersReducer,favoriteFoldersReducer } from './reducer'



const rootReducer = combineReducers({ 
    searchReducer: searchReducer,
    employeeListReducer : employeeListReducer,
    clientListReducer : clientListReducer,
    personalFoldersReducer : personalFoldersReducer,
    sharedFoldersReducer : sharedFoldersReducer,
    favoriteFoldersReducer : favoriteFoldersReducer,
})

// export const store = createStore(searchReducer)
export const store = createStore(rootReducer)