import { configureStore } from "@reduxjs/toolkit";

import sessionReducer from "./slices/sessionSlice";
import uiReducer from "./slices/uiSlice";
import { fblaApi } from "./services/fblaApi";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    ui: uiReducer,
    [fblaApi.reducerPath]: fblaApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fblaApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
