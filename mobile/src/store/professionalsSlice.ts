import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfessionalsState {
    list: any[];
    selectedProfessional: any | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProfessionalsState = {
    list: [],
    selectedProfessional: null,
    loading: false,
    error: null,
};

const professionalsSlice = createSlice({
    name: 'professionals',
    initialState,
    reducers: {
        setProfessionals: (state, action: PayloadAction<any[]>) => {
            state.list = action.payload;
        },
        selectProfessional: (state, action: PayloadAction<any>) => {
            state.selectedProfessional = action.payload;
        },
        fetchProfessionalsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProfessionalsSuccess: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.list = action.payload;
        },
        fetchProfessionalsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    setProfessionals,
    selectProfessional,
    fetchProfessionalsStart,
    fetchProfessionalsSuccess,
    fetchProfessionalsFailure
} = professionalsSlice.actions;
export default professionalsSlice.reducer;
