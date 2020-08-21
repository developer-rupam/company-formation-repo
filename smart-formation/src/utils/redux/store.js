import { createStore, combineReducers } from 'redux'
import { searchReducer } from './reducer'



const rootReducer = combineReducers({ searchReducer: searchReducer})

// export const store = createStore(searchReducer)
export const store = createStore(rootReducer)