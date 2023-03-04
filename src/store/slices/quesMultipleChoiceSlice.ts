import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../config/store";

interface MultipleChoice {
  options:(string | null)[];
  finalAnswer: string;
}

const initialState: MultipleChoice = {
  options: [],
  finalAnswer: "",
};

export const quesMultipleChoiceSlice = createSlice({
  name: "quesMultipleChoiceSlice",
  initialState,
  reducers: {
    setOptions: (state, action: PayloadAction<(string | null)[]>) => {
      state.options = action.payload;
    },
    setFinalAnswer: (state, action: PayloadAction<string>) => {
      state.finalAnswer = action.payload;
    },
  },
});

export const { setOptions, setFinalAnswer } = quesMultipleChoiceSlice.actions;
export const multipleChoiceOptionAns = (state: RootState) => state.quesMultipleChoiceSlice;

export default quesMultipleChoiceSlice.reducer;
