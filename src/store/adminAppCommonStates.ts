import {createSlice} from "@reduxjs/toolkit";
import { RootState } from "./config/store";


export interface AppState{
    saveGraphToggle:boolean;
    linkDirection:boolean;
    saveQuesModal:boolean;
    toggleAddQues:boolean;
    toggleAddHints:boolean;
};

const initialState:AppState = {
    saveGraphToggle:false,
    linkDirection:false,
    saveQuesModal:false,
    toggleAddQues:false,
    toggleAddHints:false
    
}

const appCommonSlice = createSlice({
    name:"appCommonSlice",
    initialState,
    reducers:{
        saveGraphBtn:(state,action)=>{
         state.saveGraphToggle=action.payload
        },
        toggleLinkDirection:(state,action)=>{
            state.linkDirection=action.payload
        },
        saveQuesModal:(state,action)=>{
            state.saveQuesModal = action.payload;
        },
        toggleAddQues:(state,action)=>{
            state.toggleAddQues = action.payload;
        },
        toggleAddHints:(state,action)=>{
            state.toggleAddHints = action.payload;
        }

        
    }
});
export const {saveGraphBtn,toggleLinkDirection,saveQuesModal,toggleAddQues,toggleAddHints} = appCommonSlice.actions;
export const appCommonSliceRes = (state:RootState) => state.appCommonSlice;
export default appCommonSlice.reducer;