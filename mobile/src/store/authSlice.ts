import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    role: string;
    isVerified: boolean;
    createdAt: string;
}

interface Professional {
    id: string;
    userId: string;
    category: string;
    bio?: string;
    prices?: any;
    hashtags?: string[];
    address?: string;
    latitude?: number;
    longitude?: number;
    isAvailable: boolean;
    avgRating: number;
    totalReviews: number;
    portfolioItems?: Array<{
        id: string;
        imageUrl: string;
        description?: string;
    }>;
}

interface AuthState {
    user: User | null;
    professional: Professional | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    profileComplete: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    professional: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    profileComplete: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{
            user: User;
            professional?: Professional;
            token: string;
            refreshToken: string;
            profileComplete: boolean;
        }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.professional = action.payload.professional || null;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.profileComplete = action.payload.profileComplete;
            state.error = null;
        },
        registerSuccess: (state, action: PayloadAction<{
            user: User;
            profileComplete: boolean;
        }>) => {
            state.loading = false;
            state.user = action.payload.user;
            state.profileComplete = action.payload.profileComplete;
            state.error = null;
        },
        authFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        updateProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        setProfessional: (state, action: PayloadAction<Professional>) => {
            state.professional = action.payload;
            state.profileComplete = Boolean(
                action.payload.bio &&
                action.payload.address &&
                action.payload.prices
            );
        },
        updateProfessionalProfile: (state, action: PayloadAction<Partial<Professional>>) => {
            if (state.professional) {
                state.professional = { ...state.professional, ...action.payload };
                state.profileComplete = Boolean(
                    state.professional.bio &&
                    state.professional.address &&
                    state.professional.prices
                );
            }
        },
        setProfileComplete: (state, action: PayloadAction<boolean>) => {
            state.profileComplete = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.professional = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.profileComplete = false;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    authStart,
    loginSuccess,
    registerSuccess,
    authFailure,
    setUser,
    updateProfile,
    setProfessional,
    updateProfessionalProfile,
    setProfileComplete,
    logout,
} = authSlice.actions;

export default authSlice.reducer;
