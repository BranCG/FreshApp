# FreshApp - Marketplace de Servicios a Domicilio

**MVP de aplicación móvil multiplataforma** para conectar clientes con profesionales independientes (barberos, tatuadores, manicuristas) que ofrecen servicios a domicilio.

![FreshApp Banner](docs/assets/banner.png)

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Documentación](#documentación)
- [Licencia](#licencia)

## 🎯 Visión General

FreshApp es una plataforma que revoluciona la forma en que las personas acceden a servicios de belleza y cuidado personal, conectando clientes con profesionales independientes verificados que trabajan a domicilio.

### Problema que Resuelve

- Clientes buscan comodidad de recibir servicios en casa
- Profesionales independientes necesitan visibilidad y clientes
- Falta de confianza por ausencia de verificación de identidad
- Necesidad de comunicación sin compartir números telefónicos

### Solución

Una aplicación móvil que:
- ✅ Conecta clientes con profesionales cercanos verificados
- ✅ Gestiona todo el flujo del servicio (solicitud → pago → reseña)
- ✅ Verifica identidad de profesionales
- ✅ Facilita comunicación segura mediante chat interno
- ✅ Procesa pagos digitales con comisión para la plataforma
- ✅ Mantiene reputación mediante sistema de reseñas

## ⭐ Características Principales

### Para Clientes

- 📍 **Búsqueda geolocalizada** de profesionales cercanos
- 🗺️ **Visualización en mapa** de profesionales disponibles
- 🔍 **Filtros avanzados** (categoría, precio, calificación, distancia)
- 📅 **Solicitud de servicio** con fecha/hora personalizada
- 💬 **Chat en tiempo real** con el profesional asignado
- 💳 **Pago digital seguro** con MercadoPago
- ⭐ **Sistema de reseñas** para calificar el servicio
- 🔔 **Notificaciones push** de estado del servicio

### Para Profesionales

- 📝 **Perfil profesional** con portafolio de trabajos
- ✅ **Verificación de identidad** con cédula y antecedentes
- 💰 **Gestión de precios** y servicios ofrecidos
- 🏷️ **Hashtags de personalidad** (dog lover, geek, etc.)
- 🔄 **Toggle de disponibilidad** para controlar cuando trabajar
- 📲 **Recepción de solicitudes** con opción de aceptar/rechazar
- 💵 **Dashboard de ganancias** (hoy, semana, mes)
- 📊 **Historial de servicios** y estadísticas

### Para Administradores

- 👥 **Gestión de usuarios** (clientes y profesionales)
- ✅ **Aprobación de verificaciones** de identidad
- 📊 **Analytics básicos** (usuarios, servicios, ingresos)
- 🚨 **Manejo de reportes** y denuncias

## 🏗️ Arquitectura

FreshApp está construida con una arquitectura de microservicios separando frontend móvil, backend API, y panel administrativo web.

```
┌─────────────────┐
│  Mobile App     │
│  React Native   │
└────────┬────────┘
         │
         │ REST API + WebSocket
         │
┌────────▼────────┐      ┌──────────────┐
│   Backend API   ├──────┤  PostgreSQL  │
│   Node.js +     │      │  + PostGIS   │
│   Express       │      └──────────────┘
└────────┬────────┘
         │
         ├─────────► MercadoPago (Pagos)
         ├─────────► AWS S3 (Imágenes)
         ├─────────► FCM (Push Notifications)
         └─────────► Twilio/Firebase Auth (OTP)

┌─────────────────┐
│  Admin Panel    │
│  Next.js        │
└─────────────────┘
```

### Componentes Principales

1. **Mobile App** (`/mobile`)
   - React Native + Expo
   - Redux para estado global
   - React Navigation para navegación
   - Socket.io para chat en tiempo real

2. **Backend API** (`/backend`)
   - Node.js + Express + TypeScript
   - Prisma ORM + PostgreSQL
   - JWT para autenticación
   - Socket.io para WebSocket

3. **Admin Panel** (`/admin`)
   - Next.js 14 con App Router
   - Interfaz web básica para administración

## 🛠️ Tecnologías

### Frontend (Mobile)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React Native | 0.73 | Framework móvil |
| Expo | 50.0 | Toolchain y build |
| TypeScript | 5.3 | Lenguaje tipado |
| Redux Toolkit | 2.0 | Estado global |
| React Navigation | 6.1 | Navegación |
| Socket.io Client | 4.6 | Chat en tiempo real |
| React Native Maps | 1.10 | Mapas |
| Axios | 1.6 | HTTP client |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | 18+ | Runtime |
| Express | 4.18 | Web framework |
| TypeScript | 5.3 | Lenguaje tipado |
| Prisma | 5.7 | ORM |
| PostgreSQL | 15+ | Base de datos |
| PostGIS | - | Geolocalización |
| Socket.io | 4.6 | WebSocket |
| JWT | 9.0 | Autenticación |
| MercadoPago | 2.0 | Pagos |

### Infraestructura

- **Base de datos**: PostgreSQL + PostGIS
- **Almacenamiento**: AWS S3 o Cloudinary
- **Pagos**: MercadoPago (LATAM)
- **Push Notifications**: Firebase Cloud Messaging
- **SMS/OTP**: Twilio o Firebase Auth

## 📂 Estructura del Proyecto

```
FreshApp/
├── backend/                    # API Backend
│   ├── prisma/
│   │   └── schema.prisma      # Esquema de base de datos
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Lógica de negocio
│   │   ├── middleware/        # Auth, validation, errors
│   │   └── sockets/           # WebSocket handlers
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── mobile/                     # App Móvil
│   ├── App.tsx                # Componente raíz
│   ├── src/
│   │   ├── screens/           # Pantallas
│   │   ├── components/        # Componentes reutilizables
│   │   ├── navigation/        # Navegación
│   │   ├── store/             # Redux store
│   │   ├── services/          # API y servicios
│   │   ├── theme/             # Sistema de diseño
│   │   └── types/             # TypeScript types
│   ├── app.json               # Config de Expo
│   ├── package.json
│   └── README.md
│
├── admin/                      # Panel Admin (Next.js)
│   ├── app/                   # App Router pages
│   ├── components/            # Componentes UI
│   ├── package.json
│   └── README.md
│
├── docs/                       # Documentación
│   ├── ARCHITECTURE.md        # Arquitectura detallada
│   ├── API.md                 # Documentación de API
│   ├── SETUP.md               # Guía de instalación
│   └── DEPLOYMENT.md          # Guía de despliegue
│
├── .gitignore
└── README.md                   # Este archivo
```

## 🚀 Instalación

### ⚡ Inicio Rápido

**¿Primera vez con FreshApp?** Sigue nuestra [**Guía de Inicio Rápido**](docs/QUICK_START.md) para tener todo funcionando en **30 minutos**.

### Opciones de Setup

#### Opción A: Desarrollo Local (Testing rápido)

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npx prisma generate
npx prisma migrate dev
npm run dev

# Mobile (en otra terminal)
cd mobile
npm install
npm start
```

**Nota**: Algunas funcionalidades requieren Development Build (ver Opción B).

#### Opción B: Deployment Completo con Render

1. **Deploy Backend a Render**
   - Sigue la [**Guía de Deployment en Render**](docs/RENDER_DEPLOYMENT.md)
   - Tu backend estará en: `https://tu-app.onrender.com`

2. **Crear Development Build**
   - Sigue la [**Guía de EAS Build**](docs/EAS_BUILD_GUIDE.md)
   - Instala la app en tu dispositivo
   - Conecta a tu backend en Render

### Requisitos Previos

- **Node.js** 18+ y npm
- **PostgreSQL** 15+ con PostGIS (local) o cuenta en Render
- **Expo CLI**: `npm install -g expo-cli`
- **EAS CLI**: `npm install -g eas-cli` (para Development Build)
- Cuentas en:
  - [Render](https://render.com) (para backend)
  - [Expo](https://expo.dev) (para builds móviles)
  - MercadoPago, AWS/Cloudinary, Google Maps, Firebase (opcional)

### Instalación Rápida

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd FreshApp
   ```

2. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus credenciales
   npm run prisma:migrate
   npm run dev
   ```

3. **Mobile App**
   ```bash
   cd mobile
   npm install
   # Editar src/config/environment.ts con tu URL de Render
   npm start
   ```

4. **Development Build (Recomendado)**
   ```bash
   cd mobile
   eas build --profile development --platform android
   # Instalar APK en tu dispositivo
   ```

### Configuración Detallada

Ver [docs/SETUP.md](docs/SETUP.md) para instrucciones completas de configuración.

## 📚 Documentación

- 📖 **[Guía de Instalación](docs/SETUP.md)** - Setup completo paso a paso
- 🏗️ **[Arquitectura del Sistema](docs/ARCHITECTURE.md)** - Diseño técnico detallado
- 🔌 **[Documentación de API](docs/API.md)** - Todos los endpoints REST
- 🚀 **[Guía de Despliegue](docs/DEPLOYMENT.md)** - Deploy a producción
- 📱 **[Mobile App README](mobile/README.md)** - Documentación de la app móvil
- 🖥️ **[Backend README](backend/README.md)** - Documentación del backend

## 🔄 Flujo de Usuario Completo

### Cliente solicita un servicio

1. **Registro/Login** → Verificación OTP
2. **Activar ubicación** → Ver profesionales cercanos en mapa
3. **Filtrar** por categoría, precio, calificación
4. **Ver perfil** del profesional (portafolio, reseñas, precios)
5. **Solicitar servicio** con fecha, hora y dirección
6. **Esperar aceptación** del profesional
7. **Chat** con el profesional para coordinar
8. **Profesional llega** → Inicia servicio → Completa
9. **Pagar** desde la app
10. **Dejar reseña** y calificación

### Profesional recibe y completa servicio

1. **Registro/Login** → Crear perfil profesional
2. **Subir documentos** de verificación (cédula + antecedentes)
3. **Esperar aprobación** de admin
4. **Activar disponibilidad** → Empezar a recibir solicitudes
5. **Recibir solicitud** → Ver detalles del cliente
6. **Aceptar/Rechazar** solicitud
7. **Chat** con cliente
8. **Ir al domicilio** → Marcar "Llegué"
9. **Iniciar servicio** → Completar servicio
10. **Ver ganancias** en dashboard

## 💰 Modelo de Negocio

- **Comisión por servicio**: 10% (configurable)
- **Plan premium** para profesionales (futuro):
  - Mayor visibilidad en búsquedas
  - Perfil destacado
  - Analytics avanzados

## 🔐 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Verificación de identidad obligatoria para profesionales
- ✅ Certificado de antecedentes requerido
- ✅ Chat interno (sin compartir teléfonos)
- ✅ Pagos procesados por MercadoPago (PCI compliant)
- ✅ HTTPS en todas las comunicaciones
- ✅ Almacenamiento seguro de tokens (Expo Secure Store)

## 📊 Analytics y Métricas (Admin)

- Total de usuarios (clientes y profesionales)
- Servicios completados
- Ingresos por comisiones
- Tasa de conversión
- Calificación promedio de profesionales

## 🚀 Roadmap Futuro

### Fase 2 (Post-MVP)

- [ ] Sistema de cupones y promociones
- [ ] Servicios recurrentes/suscripciones
- [ ] Múltiples métodos de pago
- [ ] Programa de referidos
- [ ] Chat con soporte técnico
- [ ] Integración con calendarios
- [ ] Sistema de favoritos

### Fase 3

- [ ] Expansión a más categorías de servicio
- [ ] Sistema de propinas
- [ ] Reservas grupales
- [ ] Web app para clientes
- [ ] Analytics avanzados
- [ ] Inteligencia artificial para recomendaciones

## 🤝 Contribución

Este es un proyecto MVP cerrado actualmente. Para reportar bugs o solicitar features, contacta al equipo de desarrollo.

## 📝 Notas de Desarrollo

### Variables de Entorno Requeridas

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret para tokens JWT
- `MERCADOPAGO_ACCESS_TOKEN`: Token de MercadoPago
- `AWS_S3_BUCKET`: Bucket de AWS S3
- `GOOGLE_MAPS_API_KEY`: API key de Google Maps
- `FCM_SERVER_KEY`: Firebase Cloud Messaging key

**Mobile:**
- URLs de API configuradas en `src/services/api.ts`
- Google Maps API key en `app.json`

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

## 👥 Equipo

**Proyecto**: FreshApp MVP
**Versión**: 1.0.0
**Fecha**: Noviembre 2025

Para más información o soporte técnico, revisa la documentación en `/docs` o contacta al equipo de desarrollo.

## 🎉 ¡Gracias por usar FreshApp!

Estamos construyendo el futuro de los servicios a domicilio. 🚀
