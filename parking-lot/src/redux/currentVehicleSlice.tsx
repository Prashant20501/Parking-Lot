import { createSlice } from "@reduxjs/toolkit";
const initialState={
    current_vehicle:""
}
const currentVehicleSlice=createSlice({
    name:"current_vehicle",
    initialState,
    reducers:{
        setVehicle:(state,action)=>{
            state.current_vehicle=action.payload;
        },
        removeVehicle:(state)=>{
            state.current_vehicle=""
        }
    }
})

export default currentVehicleSlice.reducer;
export const {setVehicle,removeVehicle}=currentVehicleSlice.actions;