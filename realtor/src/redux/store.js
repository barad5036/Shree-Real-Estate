import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { bayutApi } from "./services/bayut";
import { newsCatcherApi } from "./services/newsCatcher";
import { backendAPI } from "./services/api";

const store = configureStore({
  reducer: {
    [bayutApi.reducerPath]: bayutApi.reducer,
    [newsCatcherApi.reducerPath]: newsCatcherApi.reducer,
    [backendAPI.reducerPath]: backendAPI.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bayutApi.middleware,
      newsCatcherApi.middleware,
      backendAPI.middleware
    ),
});

export default store;
