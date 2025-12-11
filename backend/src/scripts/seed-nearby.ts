import { PrismaClient, ServiceCategory, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('📍 Buscando ubicación de referencia (usuario con datos)...');

    // Buscar un usuario con geolocalización (usamos el último actualizado)
    const referenceUser = await prisma.user.findFirst({
        where: {
            latitude: { not: null },
            longitude: { not: null },
            isActive: true,
        },
        orderBy: { updatedAt: 'desc' }
    });

    let baseLat = -33.4489; // Santiago Default
    let baseLon = -70.6693;

    if (referenceUser && referenceUser.latitude && referenceUser.longitude) {
        baseLat = referenceUser.latitude;
        baseLon = referenceUser.longitude;
        console.log(`✅ Referencia encontrada: [${baseLat}, ${baseLon}] (Usuario: ${referenceUser.firstName})`);
    } else {
        console.log('⚠️ No se encontró usuario con ubicación. Usando Santiago Centro como fallback.');
    }

    const categories = [ServiceCategory.BARBER, ServiceCategory.TATTOO_ARTIST, ServiceCategory.MANICURIST];
    const names = [
        { first: 'Carlos', last: 'Pérez' },
        { first: 'Ana', last: 'López' },
        { first: 'Miguel', last: 'Torres' },
        { first: 'Sofia', last: 'Ramírez' },
        { first: 'Jorge', last: 'Muñoz' }
    ];

    console.log('🚀 Creando 5 profesionales cercanos...');

    for (let i = 0; i < 5; i++) {
        // Generar coordenadas aleatorias en un radio de ~1-2km (0.015 grades)
        const latOffset = (Math.random() - 0.5) * 0.03;
        const lonOffset = (Math.random() - 0.5) * 0.03;

        const newLat = baseLat + latOffset;
        const newLon = baseLon + lonOffset;

        const category = categories[i % categories.length];
        const name = names[i];
        const email = `mock_prof_${Date.now()}_${i}@freshapp.com`;
        const passwordHash = await bcrypt.hash('123456', 10);

        // Crear Usuario
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName: name.first,
                lastName: name.last,
                role: UserRole.PROFESSIONAL,
                isVerified: true,
                isActive: true,
                profilePhoto: `https://ui-avatars.com/api/?name=${name.first}+${name.last}&background=random`,
            }
        });

        // Crear Perfil Profesional
        await prisma.professional.create({
            data: {
                userId: user.id,
                category,
                bio: `Experto en ${category}. Servicio de calidad garantizado. Reserva ahora!`,
                prices: JSON.stringify({ "Servicio Básico": 15000, "Premium": 25000 }), // Guardar como string JSON para evitar problemas
                address: "Ubicación Simulada Cerca",
                latitude: newLat,
                longitude: newLon,
                isAvailable: true,
                avgRating: 4.0 + Number((Math.random()).toFixed(1)),
                totalReviews: Math.floor(Math.random() * 50) + 1,
                totalServices: Math.floor(Math.random() * 100),
            }
        });

        console.log(`✨ Creado: ${name.first} ${name.last} (${category}) en [${newLat.toFixed(4)}, ${newLon.toFixed(4)}]`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
