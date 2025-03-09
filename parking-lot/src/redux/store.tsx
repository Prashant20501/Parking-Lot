import { configureStore } from "@reduxjs/toolkit";
import navbuttonReducer from "./navButtonSlice";
import userReducer from "./userSlice";
import lotsReducer from "./lotsSlice"
import prebookingReducer from "./preebookingSlice"
import currentVehicleReducer from "./currentVehicleSlice"
const store=configureStore({
    reducer:{
        'navbutton':navbuttonReducer,
        'user':userReducer,
        'lots':lotsReducer,
        'prebooking':prebookingReducer,
        'current_vehicle':currentVehicleReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store;