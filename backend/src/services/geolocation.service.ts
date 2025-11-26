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

        // Query SQL con PostGIS para calcular distancia
        // Usamos la fórmula Haversine para calcular distancia en metros
        const professionals = await prisma.$queryRaw<any[]>`
      SELECT 
        p.id,
        p.user_id,
        p.category,
        p.bio,
        p.prices,
        p.hashtags,
        p.is_available,
        p.avg_rating,
        p.total_reviews,
        p.total_services,
        u.first_name,
        u.last_name,
        u.profile_photo,
        p.latitude,
        p.longitude,
        (
          6371000 * acos(
            cos(radians(${latitude})) * 
            cos(radians(p.latitude)) * 
            cos(radians(p.longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(p.latitude))
          )
        ) AS distance
      FROM professionals p
      INNER JOIN users u ON p.user_id = u.id
      WHERE 
        u.is_active = true
        AND p.is_available = true
        AND p.latitude IS NOT NULL
        AND p.longitude IS NOT NULL
        ${category ? `AND p.category = ${category}` : ''}
        ${minRating ? `AND p.avg_rating >= ${minRating}` : ''}
      HAVING distance <= ${radius}
      ORDER BY distance ASC
      LIMIT 50
    `;

        // Filtrar por precio si se especifica
        let filteredProfessionals = professionals;
        if (maxPrice) {
            filteredProfessionals = professionals.filter((prof) => {
                if (!prof.prices) return false;
                const prices = typeof prof.prices === 'string'
                    ? JSON.parse(prof.prices)
                    : prof.prices;
                const minProfPrice = Math.min(...Object.values(prices).map(Number));
                return minProfPrice <= maxPrice;
            });
        }

        return filteredProfessionals.map((prof) => ({
            id: prof.id,
            userId: prof.user_id,
            category: prof.category,
            bio: prof.bio,
            prices: typeof prof.prices === 'string' ? JSON.parse(prof.prices) : prof.prices,
            hashtags: prof.hashtags,
            isAvailable: prof.is_available,
            avgRating: parseFloat(prof.avg_rating),
            totalReviews: prof.total_reviews,
            totalServices: prof.total_services,
            distance: Math.round(parseFloat(prof.distance)),
            user: {
                firstName: prof.first_name,
                lastName: prof.last_name,
                profilePhoto: prof.profile_photo,
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
