import { createSlice } from "@reduxjs/toolkit";
export interface User{
    id:number,
    username:string,
    first_name:string,
    last_name:string,
    is_staff:boolean
}
interface UserState {
    user: User | null; 
}
const initialState:UserState = {
    user: null,
};
const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setuser:(state,action)=>{
            state.user=action.payload;
        },
        removeuser:(state)=>{
            state.user=null;
        }
    }
})

export default userSlice.reducer;
export const {setuser,removeuser}=userSlice.actions;