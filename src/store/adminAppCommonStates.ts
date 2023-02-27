import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./config/store";

export interface AppState {
  saveGraphToggle: boolean;
  linkDirection: boolean;
  saveQuesModal: boolean;
  toggleAddQues: boolean;
  toggleAddHints: boolean;
  hintsFlush: boolean;
  graphicalHint: boolean;
  graphicalElemLen: string;
  graphicalHintValue:string;
  
}

const initialState: AppState = {
  saveGraphToggle: false,
  linkDirection: false,
  saveQuesModal: false,
  toggleAddQues: false,
  toggleAddHints: false,
  hintsFlush: false,
  graphicalHint: false,
  graphicalElemLen:"",
  graphicalHintValue:"",
};

const appCommonSlice = createSlice({
  name: "appCommonSlice",
  initialState,
  reducers: {
    saveGraphBtn: (state, action) => {
      state.saveGraphToggle = action.payload;
    },
    toggleLinkDirection: (state, action) => {
      state.linkDirection = action.payload;
    },
    saveQuesModal: (state, action) => {
      state.saveQuesModal = action.payload;
    },
    toggleAddQues: (state, action) => {
      state.toggleAddQues = action.payload;
    },
    toggleAddHints: (state, action) => {
      state.toggleAddHints = action.payload;
    },
    hintsFlushCall: (state, action) => {
      state.hintsFlush = action.payload;
    },
    passGraphicalHintsOpen: (state, action) => {
      state.graphicalHint = action.payload;
    },
    passGraphicalHintElemLen: (state, action) => {
      state.graphicalElemLen = action.payload;
    },
    passGraphicalHintvalue: (state, action) => {
      state.graphicalHintValue = action.payload;
    },
  },
});
export const {
  saveGraphBtn,
  toggleLinkDirection,
  saveQuesModal,
  toggleAddQues,
  toggleAddHints,
  hintsFlushCall,
  passGraphicalHintsOpen,
  passGraphicalHintElemLen,
  passGraphicalHintvalue
} = appCommonSlice.actions;
export const appCommonSliceRes = (state: RootState) => state.appCommonSlice;
export default appCommonSlice.reducer;
