// Script temporal para crear la base de datos
const { Client } = require('pg');

async function setupDatabase() {
    // Conectar al postgres default para crear nuestra DB
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'senior2025',
    });

    try {
        await client.connect();
        console.log('✅ Conectado a PostgreSQL');

        // Verificar si la DB ya existe
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'freshapp'"
        );

        if (result.rows.length === 0) {
            // Crear la base de datos
            await client.query('CREATE DATABASE freshapp');
            console.log('✅ Base de datos "freshapp" creada');
        } else {
            console.log('ℹ️  La base de datos "freshapp" ya existe');
        }

        // Conectar a freshapp para habilitar PostGIS
        await client.end();

        const freshappClient = new Client({
            host: 'localhost',
            port: 5432,
            database: 'freshapp',
            user: 'postgres',
            password: 'senior2025',
        });

        await freshappClient.connect();

        // Habilitar PostGIS
        await freshappClient.query('CREATE EXTENSION IF NOT EXISTS postgis');
        console.log('✅ Extensión PostGIS habilitada');

        await freshappClient.end();
        console.log('\n🎉 Todo listo! Ahora ejecuta: npm run dev');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 PostgreSQL no está escuchando en el puerto 5432.');
            console.log('Intenta con el puerto 5433:');
            console.log('Edita el .env y cambia DATABASE_URL a:');
            console.log('DATABASE_URL="postgresql://postgres:senior2025@localhost:5433/freshapp?schema=public"');
        } else if (error.message.includes('password authentication failed')) {
            console.log('\n💡 Contraseña incorrecta. Edita el .env y cambia la contraseña en DATABASE_URL');
        }
    } finally {
        process.exit();
    }
}

setupDatabase();
