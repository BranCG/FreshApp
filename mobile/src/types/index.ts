// Tipos de datos compartidos en la aplicación

export interface User {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
    isVerified: boolean;
    createdAt: string;
}

export interface Professional {
    id: string;
    userId: string;
    category: 'BARBER' | 'TATTOO_ARTIST' | 'MANICURIST';
    bio?: string;
    prices: Record<string, number>;
    hashtags: string[];
    address?: string;
    latitude?: number;
    longitude?: number;
    isAvailable: boolean;
    avgRating: number;
    totalReviews: number;
    totalServices: number;
    user?: {
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
    distance?: number;
}

export interface ServiceRequest {
    id: string;
    clientId: string;
    professionalId: string;
    category: 'BARBER' | 'TATTOO_ARTIST' | 'MANICURIST';
    status: ServiceRequestStatus;
    requestedDate: string;
    clientAddress: string;
    clientLatitude: number;
    clientLongitude: number;
    description?: string;
    estimatedPrice: number;
    acceptedAt?: string;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    createdAt: string;
    client?: {
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
    professional?: {
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
}

export type ServiceRequestStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'ARRIVED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'PAYMENT_PENDING'
    | 'PAID';

export interface Review {
    id: string;
    serviceRequestId: string;
    clientId: string;
    professionalId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    client?: {
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
}

export interface Message {
    id: string;
    serviceRequestId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender?: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
    };
}

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    isRead: boolean;
    createdAt: string;
}

export type NotificationType =
    | 'SERVICE_REQUEST'
    | 'SERVICE_ACCEPTED'
    | 'SERVICE_REJECTED'
    | 'SERVICE_STARTED'
    | 'SERVICE_COMPLETED'
    | 'PAYMENT_RECEIVED'
    | 'NEW_MESSAGE'
    | 'NEW_REVIEW'
    | 'VERIFICATION_APPROVED'
    | 'VERIFICATION_REJECTED';

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}
