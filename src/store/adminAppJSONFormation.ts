import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./config/store";

interface AdminAppJSONFormation {
  question: string;
  answerType: string;
  multipleChoice: (string | null)[];
  multipleChoiceAnswer: string;
  writtenAnswer: string;
  sageMathScript: string;
  hints: string[];
}

const initialState: AdminAppJSONFormation = {
  question: "",
  answerType: "",
  multipleChoice: [],
  multipleChoiceAnswer: "",
  writtenAnswer: "",
  sageMathScript: "",
  hints: [],
};

export const adminAppJSONFormation = createSlice({
  name: "adminAppJSONFormation",
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<string>) => {
      state.question = action.payload;
    },
    setAnswerType: (state, action: PayloadAction<string>) => {
      state.answerType = action.payload;
    },
    setMultipleChoice: (state, action: PayloadAction<(string | null)[]>) => {
      state.multipleChoice = action.payload;
    },
    setMultipleChoiceAnswer: (state, action: PayloadAction<string>) => {
      state.multipleChoiceAnswer = action.payload;
    },
    setWrittenAnswer: (state, action: PayloadAction<string>) => {
      state.writtenAnswer = action.payload;
    },
    setSageMathScript: (state, action: PayloadAction<string>) => {
      state.sageMathScript = action.payload;
    },
    setHints: (state, action: PayloadAction<string[]>) => {
      state.hints = action.payload;
    },
  },
});

export const {
  setQuestion,
  setAnswerType,
  setMultipleChoice,
  setMultipleChoiceAnswer,
  setWrittenAnswer,
  setSageMathScript,
  setHints,
} = adminAppJSONFormation.actions;
export const adminAppJSON = (state: RootState) => state.adminAppJSONFormation;

export default adminAppJSONFormation.reducer;
