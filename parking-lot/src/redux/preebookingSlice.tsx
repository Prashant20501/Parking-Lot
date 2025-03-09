import { createSlice } from "@reduxjs/toolkit";
import { assignedlot } from "../components/AssignCard/AssignCard";
interface preebokingState {
    prebooking: assignedlot | null; 
}
const initialState:preebokingState = {
    prebooking: null,
};
const preebookingSlice=createSlice({
    name:"preebooking",
    initialState,
    reducers:{
        setprebooking:(state,action)=>{
            state.prebooking=action.payload
        },
        removeprebooking:(state)=>{
            state.prebooking=null
        }
    }
})
export default preebookingSlice.reducer;
export const {setprebooking,removeprebooking}=preebookingSlice.actions