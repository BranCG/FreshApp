import { Prisma } from '@prisma/client';
import { prisma } from '../index';
import { AppError } from '../middleware/error-handler.middleware';

interface NearbyProfessionalsQuery {
    latitude: number;
    longitude: number;
    radius: number; // en metros
    category?: string;
    minRating?: number;
    maxPrice?: number;
}

export class GeolocationService {
    /**
     * Encontrar profesionales cercanos usando PostGIS
     * En SQL directo porque Prisma no soporta nativamente funciones PostGIS
     */
    static async findNearbyProfessionals(query: NearbyProfessionalsQuery) {
        const {
            latitude,
            longitude,
            radius,
            category,
            minRating,
            maxPrice,
        } = query;

        // EMERGENCY FIX: Fetch ALL professionals with location and filter in JS using Haversine.
        // This avoids complex SQL/PostGIS errors in Prisma queryRaw completely.
        const professionals = await prisma.professional.findMany({
            where: {
                isAvailable: true,
                latitude: { not: null },
                longitude: { not: null },
                user: { isActive: true }
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePhoto: true,
                    }
                }
            }
        });

        // Current location object for distance calc
        const center = { latitude, longitude };

        // Filter and Map
        const results = professionals
            .map(p => {
                const distance = this.calculateDistance(
                    center.latitude,
                    center.longitude,
                    p.latitude!,
                    p.longitude!
                );
                return { ...p, distance };
            })
            .filter(p => {
                // Radius filter
                if (p.distance > radius) return false;

                // Category filter
                if (category && p.category !== category) return false;

                // Rating filter
                if (minRating && p.avgRating < minRating) return false;

                // Price filter
                if (maxPrice) {
                    if (!p.prices) return false;
                    const prices = typeof p.prices === 'string'
                        ? JSON.parse(p.prices)
                        : p.prices;
                    const values = Object.values(prices as any).map((v: any) =>
                        typeof v === 'object' ? Number(v.price) : Number(v)
                    );
                    const minProfPrice = Math.min(...values);
                    if (minProfPrice > maxPrice) return false;
                }

                return true;
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 50);

        return results.map((prof) => ({
            id: prof.id,
            userId: prof.userId,
            category: prof.category,
            bio: prof.bio,
            prices: typeof prof.prices === 'string' ? JSON.parse(prof.prices) : prof.prices,
            hashtags: prof.hashtags,
            isAvailable: prof.isAvailable,
            avgRating: prof.avgRating, // It's Float in Prisma, no parsing needed
            totalReviews: prof.totalReviews,
            totalServices: prof.totalServices,
            distance: Math.round(prof.distance),
            latitude: prof.latitude,
            longitude: prof.longitude,
            user: {
                firstName: prof.user.firstName,
                lastName: prof.user.lastName,
                profilePhoto: prof.user.profilePhoto,
            },
        }));
    }

    /**
     * Calcular distancia entre dos puntos (Haversine formula)
     */
    static calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371000; // Radio de la Tierra en metros
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
            Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Validar coordenadas
     */
    static validateCoordinates(latitude: number, longitude: number): boolean {
        return (
            latitude >= -90 &&
            latitude <= 90 &&
            longitude >= -180 &&
            longitude <= 180
        );
    }
}
