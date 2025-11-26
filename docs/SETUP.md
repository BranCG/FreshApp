# Guía de Instalación - FreshApp MVP

Esta guía te llevará paso a paso por la instalación completa de FreshApp en tu entorno local de desarrollo.

## 📋 Requisitos del Sistema

### Software Requerido

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 15.0 con extensión PostGIS
- **Git**
- **Expo CLI** (se instalará globalmente)

### Para Desarrollo Móvil

#### Android
- Android Studio con Android SDK
- Java Development Kit (JDK) 11+
- Emulador Android o dispositivo físico

#### iOS (solo macOS)
- Xcode 14+
- CocoaPods
- Simulator iOS o dispositivo físico

### Cuentas de Servicios Externos

Necesitarás crear cuentas gratuitas (o de desarrollo) en:

1. **MercadoPago**: https://www.mercadopago.com.ar/developers
2. **Google Cloud** (para Maps API): https://console.cloud.google.com
3. **AWS** (para S3) o **Cloudinary**: https://aws.amazon.com / https://cloudinary.com
4. **Firebase** (para notificaciones push): https://console.firebase.google.com
5. **Twilio** (opcional, para OTP por SMS): https://www.twilio.com

---

## 🗄️ Parte 1: Configuración de Base de Datos

### 1.1 Instalar PostgreSQL

#### Windows
```bash
# Descargar instalador desde:
https://www.postgresql.org/download/windows/

# Instalar con configuración por defecto
# Puerto: 5432
# Usuario: postgres
# Contraseña: (tu contraseña)
```

#### macOS
```bash
# Con Homebrew
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 1.2 Instalar PostGIS

#### Windows
PostGIS se incluye en el instalador de PostgreSQL (Stack Builder)

#### macOS
```bash
brew install postgis
```

#### Linux
```bash
sudo apt install postgis postgresql-15-postgis-3
```

### 1.3 Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE freshapp;

# Conectar a la base de datos
\c freshapp

# Habilitar extensión PostGIS
CREATE EXTENSION postgis;

# Verificar instalación
SELECT PostGIS_version();

# Salir
\q
```

### 1.4 Configurar Usuario (Opcional)

```sql
-- Crear usuario específico para la app
CREATE USER freshapp_user WITH PASSWORD 'tu_password_seguro';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE freshapp TO freshapp_user;
```

---

## 🔧 Parte 2: Backend Setup

### 2.1 Instalar Dependencias

```bash
cd backend
npm install
```

### 2.2 Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu editor favorito
nano .env   # o code .env, vim .env, etc.
```

**Configuración mínima para desarrollo:**

```env
# Database
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/freshapp?schema=public"

# JWT (genera secretos aleatorios seguros)
JWT_SECRET=genera_un_secreto_aleatorio_aqui_para_jwt
JWT_REFRESH_SECRET=otro_secreto_aleatorio_para_refresh_token
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# MercadoPago (usar credenciales de prueba inicialmente)
MERCADOPAGO_ACCESS_TOKEN=TEST-tu_access_token_de_prueba
MERCADOPAGO_PUBLIC_KEY=TEST-tu_public_key_de_prueba
PLATFORM_COMMISSION_PERCENTAGE=10

# AWS S3 o usa Cloudinary
AWS_ACCESS_KEY_ID=tu_aws_access_key
AWS_SECRET_ACCESS_KEY=tu_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=freshapp-dev

# Google Maps
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Firebase (opcional para OTP y push notifications)
FCM_SERVER_KEY=tu_firebase_server_key

# Twilio (opcional para SMS OTP)
TWILIO_ACCOUNT_SID=tu_twilio_account_sid
TWILIO_AUTH_TOKEN=tu_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 2.3 Generar Secretos JWT

Puedes generar secretos seguros con:

```bash
# En terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Ejecutar Migraciones de Prisma

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver la BD
npm run prisma:studio
```

### 2.5 Seed Inicial (Opcional)

Crear un archivo `prisma/seed.ts` para datos iniciales:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@freshapp.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'FreshApp',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Ejecutar seed:

```bash
npx ts-node prisma/seed.ts
```

### 2.6 Iniciar Servidor Backend

```bash
# Modo desarrollo (con hot reload)
npm run dev

# El servidor correrá en http://localhost:3000
```

Deberías ver:
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en puerto 3000
📍 API URL: http://localhost:3000/api
🌍 Entorno: development
```

---

## 📱 Parte 3: Mobile App Setup

### 3.1 Instalar Expo CLI

```bash
npm install -g expo-cli
```

### 3.2 Instalar Dependencias

```bash
cd mobile
npm install
```

### 3.3 Configurar Google Maps API

#### Obtener API Key

1. Ve a https://console.cloud.google.com
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (opcional)
4. Ve a "Credentials" → "Create Credentials" → "API Key"
5. Copia la API Key

#### Configurar en la App

Edita `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "TU_GOOGLE_MAPS_API_KEY_AQUI"
        }
      }
    },
    "ios": {
      "config": {
        "googleMapsApiKey": "TU_GOOGLE_MAPS_API_KEY_AQUI"
      }
    }
  }
}
```

### 3.4 Configurar URL del Backend

Edita `src/services/api.ts`:

```typescript
const API_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Desarrollo
  : 'https://tu-api-produccion.com/api';
```

**Nota para Android:**
- Emulador: usa `http://10.0.2.2:3000/api`
- Dispositivo físico: usa la IP de tu computadora, ej: `http://192.168.1.100:3000/api`

Para obtener tu IP:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

### 3.5 Iniciar la App

```bash
npm start
```

Esto abrirá Expo Developer Tools en tu navegador.

#### Ejecutar en Emulador/Dispositivo

**Android:**
```bash
npm run android
```

**iOS (solo macOS):**
```bash
npm run ios
```

**Dispositivo físico:**
1. Instala "Expo Go" desde App Store/Play Store
2. Escanea el QR code que aparece en la terminal

---

## 🌐 Parte 4: Servicios Externos

### 4.1 Configurar MercadoPago

#### Obtener Credenciales de Prueba

1. Ve a https://www.mercadopago.com.ar/developers
2. Crea una aplicación
3. Ve a "Credenciales de prueba"
4. Copia el `ACCESS_TOKEN` y `PUBLIC_KEY`
5. Agrégalos al `.env` del backend

#### Tarjetas de Prueba

MercadoPago provee tarjetas para testing:

https://www.mercadopago.com.ar/developers/es/docs/testing/test-cards

### 4.2 Configurar AWS S3 (Almacenamiento de Imágenes)

#### Opción A: AWS S3

1. **Crear cuenta en AWS**: https://aws.amazon.com
2. **Crear bucket**:
   - Ve a S3 Console
   - Click "Create bucket"
   - Nombre: `freshapp-dev`
   - Región: `us-east-1`
   - Desbloquear acceso público (solo para desarrollo)
   - Habilitar versionado (opcional)

3. **Crear usuario IAM**:
   - Ve a IAM Console
   - "Users" → "Add user"
   - Nombre: `freshapp-s3-user`
   - Access type: "Programmatic access"
   - Attach policy: `AmazonS3FullAccess`
   - Guarda Access Key ID y Secret Access Key

4. **Configurar CORS en el bucket**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

5. **Agregar credenciales al `.env`**

#### Opción B: Cloudinary (Alternativa más simple)

1. Crea cuenta en https://cloudinary.com (plan free)
2. Ve al Dashboard
3. Copia:
   - Cloud Name
   - API Key
   - API Secret
4. Modifica el código en `src/services/file-upload.service.ts` para usar Cloudinary SDK

### 4.3 Configurar Firebase (Notificaciones Push)

1. **Crear proyecto**: https://console.firebase.google.com
   - Click "Add project"
   - Nombre: "FreshApp"
   - Deshabilitar Google Analytics (opcional)

2. **Agregar app Android**:
   - Click ícono de Android
   - Package name: `com.freshapp` (debe coincidir con `app.json`)
   - Descargar `google-services.json`
   - Colocar en `mobile/`

3. **Agregar app iOS**:
   - Click ícono de iOS
   - Bundle ID: `com.freshapp`
   - Descargar `GoogleService-Info.plist`
   - Colocar en `mobile/ios/` (si usas bare workflow)

4. **Obtener Server Key**:
   - Ve a Project Settings → Cloud Messaging
   - Copia el "Server key"
   - Agrégalo a `.env` como `FCM_SERVER_KEY`

5. **Configurar en Expo**:

```json
// app.json
{
  "expo": {
    "plugins": [
      "expo-notifications"
    ]
  }
}
```

### 4.4 Configurar Twilio (SMS/OTP) - Opcional

1. Crea cuenta en https://www.twilio.com (trial account)
2. Ve al Dashboard
3. Copia:
   - Account SID
   - Auth Token
   - Compra un número de teléfono (o usa el de prueba)
4. Agrégalos al `.env`

---

## ✅ Parte 5: Verificación de Instalación

### 5.1 Test del Backend

```bash
# En una terminal, con el backend corriendo
curl http://localhost:3000/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "timestamp": "2025-11-26T...",
  "environment": "development"
}
```

### 5.2 Test de Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "CLIENT"
  }'
```

### 5.3 Test de la App Móvil

1. Abre la app en el emulador/dispositivo
2. Deberías ver la pantalla de Welcome
3. Intenta registrarte como cliente
4. Verifica que el OTP se genere (check logs del backend)

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

- Verifica que PostgreSQL esté corriendo
- Verifica el `DATABASE_URL` en `.env`
- Intenta conectarte manualmente: `psql -U postgres -d freshapp`

### Error: "Prisma Client is not installed"

```bash
npm run prisma:generate
```

### Error: Metro Bundler no inicia (Mobile)

```bash
cd mobile
npm start -- --reset-cache
```

### Error: Maps no se muestra en la app

- Verifica que la API Key esté configurada en `app.json`
- Verifica que Maps SDK esté habilitado en Google Cloud Console
- Para Android, espera 5-10 minutos después de configurar la API Key

### Error: "Network request failed" en la app

- Verifica que el backend esté corriendo
- Verifica la URL en `src/services/api.ts`
- Si usas Android en dispositivo físico, usa la IP de tu computadora
- Desactiva temporalmente el firewall

---

## 📚 Próximos Pasos

Una vez que todo esté instalado y funcionando:

1. **Lee la documentación de API**: `docs/API.md`
2. **Familiarízate con la arquitectura**: `docs/ARCHITECTURE.md`
3. **Explora el código del mobile**: `mobile/src/`
4. **Prueba el flujo completo**:
   - Registrar un cliente
   - Registrar un profesional
   - Buscar profesionales
   - Solicitar un servicio
   - Chat
   - Completar servicio
   - Pago
   - Reseña

---

## 🎉 ¡Listo!

Tu entorno de desarrollo de FreshApp está completo. Si encuentras problemas, revisa:

- Logs del backend: terminal donde corre `npm run dev`
- Logs de Expo: terminal de `npm start`
- Consola del navegador (Expo DevTools)
- Prisma Studio para ver la base de datos

¡Happy coding! 🚀
