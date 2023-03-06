import { configureStore } from "@reduxjs/toolkit";
import appCommonSlice from "../adminAppCommonStates";
import hintsWithOrderSlice from "../slices/hintsWithOrderSlice";
import quesMultipleChoiceSlice from "../slices/quesMultipleChoiceSlice";
import textHintSlice from "../slices/textHintSlice";

const store = configureStore({
    reducer:{
        appCommonSlice,
        textHintSlice,
        quesMultipleChoiceSlice,
        hintsWithOrderSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;