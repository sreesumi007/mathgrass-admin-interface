import { configureStore } from "@reduxjs/toolkit";
import appCommonSlice from "../adminAppCommonStates";

const store = configureStore({
    reducer:{
        appCommonSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;