import { createSlice } from "@reduxjs/toolkit";
export interface Lots{
    FW:number,
    TW:number
}
interface LotsState {
    lots: Lots | null; 
}
const initialState:LotsState = {
    lots: null,
};
const lotsSlice=createSlice({
    name:"lots",
    initialState,
    reducers:{
        setlots:(state,action)=>{
            state.lots=action.payload;
        },
    }
})
export default lotsSlice.reducer;
export const {setlots}=lotsSlice.actions;