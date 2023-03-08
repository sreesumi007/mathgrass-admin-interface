import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./config/store";

export interface AppState {
  saveGraphToggle: boolean;
  linkDirection: boolean;
  saveQuesModal: boolean;
  toggleAddQues: boolean;
  toggleAddHints: boolean;
  hintsFlush: boolean;
  questionFlush:boolean;
  graphicalHint: boolean;
  graphicalElemLen: string;
  graphicalHintValue:string;
  scriptHintValue:string;
  openOrderHintsModal:boolean;
  openTextualAndScriptHints:boolean;
  
}

const initialState: AppState = {
  saveGraphToggle: false,
  linkDirection: false,
  saveQuesModal: false,
  toggleAddQues: false,
  toggleAddHints: false,
  hintsFlush: false,
  questionFlush: false,
  graphicalHint: false,
  openOrderHintsModal:false,
  openTextualAndScriptHints:false,
  graphicalElemLen:"",
  graphicalHintValue:"",
  scriptHintValue:"",
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
    questionFlushCall: (state, action) => {
      state.questionFlush = action.payload;
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
    passScriptHintvalue: (state, action) => {
      state.scriptHintValue = action.payload;
    },
    passOrderHintsOpen: (state, action) => {
      state.openOrderHintsModal = action.payload;
    },
    openTextualAndScriptHints: (state, action) => {
      state.openTextualAndScriptHints = action.payload;
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
  questionFlushCall,
  passGraphicalHintsOpen,
  passGraphicalHintElemLen,
  passGraphicalHintvalue,
  passScriptHintvalue,
  passOrderHintsOpen,
  openTextualAndScriptHints
} = appCommonSlice.actions;
export const appCommonSliceRes = (state: RootState) => state.appCommonSlice;
export default appCommonSlice.reducer;
