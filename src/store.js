import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/landingPage';

const reducer = {
  users: userReducer
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export default store;