import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import authReducer from './authSlice'
import productReducer from './productSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    products: productReducer,
  },
});

// Ye dono lines lazmi 'export' honi chahiye
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 