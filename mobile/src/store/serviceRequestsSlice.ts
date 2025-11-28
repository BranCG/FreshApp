import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceRequestsState {
    list: any[];
    currentRequest: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: ServiceRequestsState = {
    list: [],
    currentRequest: null,
    loading: false,
    error: null,
};

const serviceRequestsSlice = createSlice({
    name: 'serviceRequests',
    initialState,
    reducers: {
        setRequests: (state, action: PayloadAction<any[]>) => {
            state.list = action.payload;
        },
        addRequest: (state, action: PayloadAction<any>) => {
            state.list.push(action.payload);
        },
        updateRequest: (state, action: PayloadAction<any>) => {
            const index = state.list.findIndex(r => r.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        createRequestStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        createRequestSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.currentRequest = action.payload;
            state.list.push(action.payload);
        },
        createRequestFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    setRequests,
    addRequest,
    updateRequest,
    createRequestStart,
    createRequestSuccess,
    createRequestFailure
} = serviceRequestsSlice.actions;
export default serviceRequestsSlice.reducer;
