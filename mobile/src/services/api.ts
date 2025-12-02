import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import ENV from '../config/environment';

// Configuración de la API - Ahora usa variables de entorno
const API_URL = ENV.apiUrl;

console.log('🌐 API URL configurada:', API_URL);


// Crear instancia de axios
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta y refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos intentado refrescar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data;
                    await SecureStore.setItemAsync('accessToken', accessToken);

                    // Reintentar la petición original con el nuevo token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Si falla el refresh, cerrar sesión
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                // Redirigir al login (manejar en el componente)
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

// ========== AUTH API ==========

export const authAPI = {
    register: (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: 'CLIENT' | 'PROFESSIONAL';
        phone?: string;
    }) => api.post('/auth/register', data),

    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    verifyOTP: (userId: string, code: string) =>
        api.post('/auth/verify-otp', { userId, code }),

    refreshToken: (refreshToken: string) =>
        api.post('/auth/refresh-token', { refreshToken }),
};

// ========== USER API ==========

export const userAPI = {
    getProfile: () => api.get('/users/me'),

    updateProfile: (data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
    }) => api.put('/users/me', data),

    uploadPhoto: (formData: FormData) =>
        api.post('/users/me/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

// ========== PROFESSIONAL API ==========

export const professionalAPI = {
    getNearby: (params: {
        latitude: number;
        longitude: number;
        radius?: number;
        category?: string;
        minRating?: number;
        maxPrice?: number;
    }) => api.get('/professionals/nearby', { params }),

    getById: (id: string) => api.get(`/professionals/${id}`),

    createProfile: (data: {
        category: string;
        bio?: string;
        prices: Record<string, number>;
        hashtags?: string[];
        address: string;
        latitude: number;
        longitude: number;
    }) => api.post('/professionals/profile', data),

    updateProfile: (data: any) => api.put('/professionals/me', data),

    toggleAvailability: (isAvailable: boolean) =>
        api.patch('/professionals/me/availability', { isAvailable }),

    addPortfolioItem: (formData: FormData) =>
        api.post('/professionals/me/portfolio', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deletePortfolioItem: (itemId: string) =>
        api.delete(`/professionals/me/portfolio/${itemId}`),

    submitVerification: (formData: FormData) =>
        api.post('/professionals/me/verification', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

// ========== SERVICE REQUEST API ==========

export const serviceRequestAPI = {
    create: (data: {
        professionalId: string;
        category: string;
        requestedDate: string;
        clientAddress: string;
        clientLatitude: number;
        clientLongitude: number;
        estimatedPrice: number;
        description?: string;
    }) => api.post('/service-requests', data),

    getAll: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/service-requests', { params }),

    getById: (id: string) => api.get(`/service-requests/${id}`),

    accept: (id: string) => api.patch(`/service-requests/${id}/accept`),

    reject: (id: string, reason?: string) =>
        api.patch(`/service-requests/${id}/reject`, { reason }),

    arrive: (id: string) => api.patch(`/service-requests/${id}/arrive`),

    start: (id: string) => api.patch(`/service-requests/${id}/start`),

    complete: (id: string) => api.patch(`/service-requests/${id}/complete`),

    cancel: (id: string, reason?: string) =>
        api.patch(`/service-requests/${id}/cancel`, { reason }),
};

// ========== PAYMENT API ==========

export const paymentAPI = {
    process: (data: {
        serviceRequestId: string;
        paymentMethodId: string;
        amount: number;
    }) => api.post('/payments/process', data),

    getHistory: () => api.get('/payments/history'),

    getEarnings: () => api.get('/payments/earnings'),
};

// ========== REVIEW API ==========

export const reviewAPI = {
    create: (data: {
        serviceRequestId: string;
        professionalId: string;
        rating: number;
        comment?: string;
    }) => api.post('/reviews', data),

    getByProfessional: (professionalId: string) =>
        api.get(`/reviews/professional/${professionalId}`),
};

// ========== CHAT API ==========

export const chatAPI = {
    getMessages: (serviceRequestId: string, params?: { page?: number; limit?: number }) =>
        api.get(`/chat/${serviceRequestId}/messages`, { params }),

    sendMessage: (serviceRequestId: string, content: string) =>
        api.post(`/chat/${serviceRequestId}/messages`, { content }),
};

// ========== NOTIFICATION API ==========

export const notificationAPI = {
    getAll: (params?: { page?: number; limit?: number }) =>
        api.get('/notifications', { params }),

    markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),

    markAllAsRead: () => api.patch('/notifications/read-all'),

    registerDevice: (deviceToken: string, platform: string) =>
        api.post('/notifications/register-device', { deviceToken, platform }),
};
