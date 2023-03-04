import { configureStore } from "@reduxjs/toolkit";
import appCommonSlice from "../adminAppCommonStates";
import quesMultipleChoiceSlice from "../slices/quesMultipleChoiceSlice";
import textHintSlice from "../slices/textHintSlice";

const store = configureStore({
    reducer:{
        appCommonSlice,
        textHintSlice,
        quesMultipleChoiceSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;