# FreshApp Backend

Backend API para FreshApp - Marketplace de servicios a domicilio (barberos, tatuadores, manicuristas).

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL + PostGIS (geolocalización)
- **ORM**: Prisma
- **Autenticación**: JWT
- **WebSocket**: Socket.io (chat en tiempo real)
- **Pagos**: MercadoPago
- **Almacenamiento**: AWS S3
- **Notificaciones**: Firebase Cloud Messaging

## 📁 Estructura del Proyecto

```
backend/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── index.ts               # Punto de entrada del servidor
│   ├── middleware/            # Middlewares (auth, validación, errores)
│   ├── routes/                # Rutas de la API
│   ├── services/              # Lógica de negocio
│   └── sockets/               # Handlers de Socket.io
├── .env.example               # Variables de entorno de ejemplo
├── package.json
└── tsconfig.json
```

## 🚀 Instalación y Configuración

### 1. Requisitos Previos

- Node.js 18+
- PostgreSQL 15+ con extensión PostGIS
- Redis (opcional, para cache)
- Cuenta de MercadoPago
- Bucket de AWS S3 (o Cloudinary)

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/freshapp"
JWT_SECRET=tu_secreto_jwt_super_seguro
MERCADOPAGO_ACCESS_TOKEN=tu_token_de_mercadopago
AWS_S3_BUCKET=tu_bucket_s3
# ... más configuraciones
```

### 4. Configurar Base de Datos

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver la DB
npm run prisma:studio
```

### 5. Iniciar Servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/verify-otp` - Verificar código OTP
- `POST /api/auth/refresh-token` - Refrescar token
- `POST /api/auth/forgot-password` - Recuperar contraseña

### Usuarios

- `GET /api/users/me` - Obtener perfil
- `PUT /api/users/me` - Actualizar perfil
- `POST /api/users/me/photo` - Subir foto de perfil

### Profesionales

- `GET /api/professionals/nearby` - Buscar profesionales cercanos
- `GET /api/professionals/:id` - Detalles de profesional
- `POST /api/professionals/profile` - Crear perfil profesional
- `PUT /api/professionals/me` - Actualizar perfil
- `PATCH /api/professionals/me/availability` - Toggle disponibilidad
- `POST /api/professionals/me/portfolio` - Agregar foto al portafolio
- `DELETE /api/professionals/me/portfolio/:itemId` - Eliminar foto
- `POST /api/professionals/me/verification` - Subir documentos de verificación

### Solicitudes de Servicio

- `POST /api/service-requests` - Crear solicitud
- `GET /api/service-requests` - Listar solicitudes
- `GET /api/service-requests/:id` - Detalles de solicitud
- `PATCH /api/service-requests/:id/accept` - Aceptar (profesional)
- `PATCH /api/service-requests/:id/reject` - Rechazar (profesional)
- `PATCH /api/service-requests/:id/arrive` - Marcar llegada
- `PATCH /api/service-requests/:id/start` - Iniciar servicio
- `PATCH /api/service-requests/:id/complete` - Completar servicio
- `PATCH /api/service-requests/:id/cancel` - Cancelar

### Pagos

- `POST /api/payments/process` - Procesar pago
- `GET /api/payments/history` - Historial de pagos
- `GET /api/payments/earnings` - Ganancias (profesional)

### Reseñas

- `POST /api/reviews` - Crear reseña
- `GET /api/reviews/professional/:id` - Reseñas de un profesional

### Chat

- `GET /api/chat/:serviceRequestId/messages` - Historial de mensajes
- `POST /api/chat/:serviceRequestId/messages` - Enviar mensaje (REST fallback)

### Notificaciones

- `GET /api/notifications` - Listar notificaciones
- `PATCH /api/notifications/:id/read` - Marcar como leída
- `PATCH /api/notifications/read-all` - Marcar todas como leídas
- `POST /api/notifications/register-device` - Registrar token FCM

### Admin

- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/professionals/pending-verification` - Verificaciones pendientes
- `PATCH /api/admin/professionals/:id/verify` - Aprobar/Rechazar verificación
- `GET /api/admin/service-requests` - Todas las solicitudes
- `GET /api/admin/analytics` - Analíticas básicas

## 🔌 WebSocket (Socket.io)

### Eventos del Cliente

- `join_chat` - Unirse a un chat
- `send_message` - Enviar mensaje
- `typing` - Indicador de escritura
- `read_messages` - Marcar mensajes como leídos

### Eventos del Servidor

- `joined_chat` - Confirmación de unión
- `message_received` - Nuevo mensaje
- `user_typing` - Otro usuario está escribiendo
- `messages_read` - Mensajes marcados como leídos
- `notification` - Nueva notificación
- `error` - Error

## 🗄️ Modelos de Base de Datos

- **User** - Usuarios (clientes, profesionales, admins)
- **Professional** - Perfil profesional
- **Verification** - Verificación de identidad
- **PortfolioItem** - Fotos del portafolio
- **ServiceRequest** - Solicitudes de servicio
- **Payment** - Pagos
- **Review** - Reseñas
- **Message** - Mensajes del chat
- **Notification** - Notificaciones
- **DeviceToken** - Tokens de dispositivos para push

## 🔐 Autenticación

Todas las rutas (excepto `/api/auth/*`) requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

## 🧪 Testing

```bash
npm test
```

## 📝 Notas de Desarrollo

- El código OTP generado es solo para desarrollo. En producción, integrar con Twilio o Firebase Auth.
- Las push notifications requieren configurar Firebase Cloud Messaging.
- Los archivos se suben a S3. Configurar credenciales AWS en `.env`.
- MercadoPago requiere tokens de producción para ambiente real.

## 🚀 Deployment

1. Configurar PostgreSQL con PostGIS en producción
2. Configurar variables de entorno en el servidor
3. Ejecutar migraciones de Prisma
4. Compilar TypeScript: `npm run build`
5. Iniciar: `npm start`

## 📄 Licencia

MIT
