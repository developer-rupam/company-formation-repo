import { createStore, combineReducers } from 'redux'
import { searchReducer,employeeListReducer,clientListReducer } from './reducer'



const rootReducer = combineReducers({ 
    searchReducer: searchReducer,
    employeeListReducer : employeeListReducer,
    clientListReducer : clientListReducer,
})

// export const store = createStore(searchReducer)
export const store = createStore(rootReducer)