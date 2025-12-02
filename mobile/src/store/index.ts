import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import professionalsReducer from './professionalsSlice';
import serviceRequestsReducer from './serviceRequestsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        professionals: professionalsReducer,
        serviceRequests: serviceRequestsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
