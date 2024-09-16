import { configureStore } from '@reduxjs/toolkit';
import { applicationReducer } from './applicationSlice';
import { userReducer } from './userSlice';

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;