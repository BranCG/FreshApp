# FreshApp Mobile - Aplicación Móvil Multiplataforma

Aplicación móvil React Native + Expo para FreshApp - Marketplace de servicios a domicilio.

## 🚀 Características

- ✅ Autenticación con JWT y OTP
- 📍 Geolocalización y búsqueda de profesionales cercanos
- 🗺️ Integración con Google Maps
- 💬 Chat en tiempo real con Socket.io
- 💳 Integración de pagos con MercadoPago
- ⭐ Sistema de reseñas y calificaciones
- 🔔 Notificaciones push
- 📸 Carga de imágenes (perfil, portafolio, documentos)
- 🎨 UI/UX moderna y responsive

## 📱 Stack Tecnológico

- **Framework**: React Native + Expo 50
- **Lenguaje**: TypeScript
- **Navegación**: React Navigation 6
- **Estado**: Redux Toolkit
- **UI**: React Native Paper + componentes personalizados
- **Mapas**: react-native-maps
- **Chat en tiempo real**: Socket.io-client
- **HTTP**: Axios
- **Formularios**: React Hook Form + Yup
- **Almacenamiento seguro**: Expo Secure Store

## 📁 Estructura del Proyecto

```
mobile/
├── App.tsx                    # Componente raíz
├── app.json                   # Configuración de Expo
├── package.json
├── tsconfig.json
└── src/
    ├── components/            # Componentes reutilizables
    │   ├── ProfessionalCard.tsx
    │   ├── ServiceRequestCard.tsx
    │   ├── ChatMessage.tsx
    │   ├── StarRating.tsx
    │   ├── MapView.tsx
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   └── ...
    ├── screens/               # Pantallas de la aplicación
    │   ├── auth/
    │   │   ├── WelcomeScreen.tsx
    │   │   ├── LoginScreen.tsx
    │   │   ├── RegisterScreen.tsx
    │   │   └── OTPVerificationScreen.tsx
    │   ├── client/
    │   │   ├── ClientHomeScreen.tsx
    │   │   ├── ProfessionalListScreen.tsx
    │   │   ├── ProfessionalDetailScreen.tsx
    │   │   ├── ServiceRequestScreen.tsx
    │   │   ├── ChatScreen.tsx
    │   │   ├── PaymentScreen.tsx
    │   │   ├── ReviewScreen.tsx
    │   │   └── ClientProfileScreen.tsx
    │   ├── professional/
    │   │   ├── ProfessionalHomeScreen.tsx
    │   │   ├── PendingRequestsScreen.tsx
    │   │   ├── ProfileEditorScreen.tsx
    │   │   ├── PortfolioScreen.tsx
    │   │   ├── EarningsScreen.tsx
    │   │   └── VerificationScreen.tsx
    │   └── shared/
    │       ├── ServiceInProgressScreen.tsx
    │       ├── NotificationsScreen.tsx
    │       └── SettingsScreen.tsx
    ├── navigation/            # Configuración de navegación
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   ├── ClientNavigator.tsx
    │   └── ProfessionalNavigator.tsx
    ├── store/                 # Redux store
    │   ├── index.ts
    │   ├── authSlice.ts
    │   ├── userSlice.ts
    │   ├── professionalsSlice.ts
    │   └── serviceRequestsSlice.ts
    ├── services/              # Servicios
    │   ├── api.ts            # Cliente API
    │   ├── socket.ts         # Socket.io cliente
    │   ├── location.ts       # Servicios de geolocalización
    │   ├── notifications.ts  # Push notifications
    │   └── storage.ts        # AsyncStorage helpers
    ├── theme/                 # Sistema de diseño
    │   ├── index.ts
    │   ├── colors.ts
    │   ├── typography.ts
    │   └── spacing.ts
    ├── types/                 # Definiciones de TypeScript
    │   └── index.ts
    └── utils/                 # Utilidades
        ├── formatters.ts
        ├── validators.ts
        └── constants.ts
```

## 🛠️ Instalación y Configuración

### 1. Requisitos Previos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Cuenta de Expo (opcional, para builds)
- Android Studio o Xcode para desarrollo nativo

### 2. Instalar Dependencias

```bash
cd mobile
npm install
```

### 3. Configurar Variables de Entorno

Las URLs de la API se configuran en `src/services/api.ts`:

```typescript
const API_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Desarrollo local
  : 'https://tu-api-produccion.com/api';  // Producción
```

Para Android en emulador usa `http://10.0.2.2:3000/api`
Para Android en dispositivo físico usa la IP de tu computadora

### 4. Configurar Google Maps

Edita `app.json` y agrega tu API Key de Google Maps:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "TU_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

Para iOS, agrega en `ios/Podfile`:

```ruby
platform :ios, '13.0'
```

### 5. Ejecutar la Aplicación

**Iniciar Expo:**
```bash
npm start
```

**Ejecutar en Android:**
```bash
npm run android
```

**Ejecutar en iOS (solo macOS):**
```bash
npm run ios
```

**Ejecutar en Web:**
```bash
npm run web
```

## 📱 Pantallas Principales

### Autenticación

1. **Welcome Screen** - Pantalla de bienvenida con opciones de rol
2. **Login Screen** - Inicio de sesión
3. **Register Screen** - Registro (cliente/profesional)
4. **OTP Verification** - Verificación de código

### Cliente

1. **Client Home** - Mapa con profesionales cercanos
2. **Professional List** - Lista de profesionales con filtros
3. **Professional Detail** - Perfil completo del profesional
4. **Service Request** - Formulario de solicitud de servicio
5. **Chat** - Chat con el profesional
6. **Service In Progress** - Estado del servicio en curso
7. **Payment** - Pantalla de pago
8. **Review** - Dejar reseña
9. **Client Profile** - Perfil del cliente

### Profesional

1. **Professional Home** - Dashboard con estadísticas
2. **Pending Requests** - Solicitudes pendientes
3. **Profile Editor** - Editar perfil profesional
4. **Portfolio** - Galería de trabajos
5. **Earnings** - Ganancias y estadísticas
6. **Verification** - Subir documentos de verificación

## 🔄 Flujo de Usuario

### Cliente

1. **Registro/Login** → Verificar OTP → Home
2. **Buscar profesionales** → Ver en mapa o lista
3. **Seleccionar profesional** → Ver detalles → Solicitar servicio
4. **Esperar aceptación** → Chat disponible
5. **Profesional llega** → Servicio inicia → Servicio completa
6. **Realizar pago** → Dejar reseña

### Profesional

1. **Registro/Login** → Completar perfil → Subir documentos
2. **Esperar aprobación admin**
3. **Activar disponibilidad** → Recibir solicitudes
4. **Aceptar/Rechazar solicitud** → Chat con cliente
5. **Llegar al domicilio** → Iniciar servicio → Completar
6. **Ver ganancias**

## 🔔 Notificaciones Push

Para configurar notificaciones push:

1. Crear proyecto en Firebase Console
2. Descargar `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
3. Configurar en `app.json`:

```json
"plugins": [
  "expo-notifications",
  [
    "expo-notifications",
    {
      "icon": "./assets/notification-icon.png",
      "color": "#6200EE"
    }
  ]
]
```

## 🗺️ Mapas y Geolocalización

La app usa `expo-location` para obtener ubicación del usuario y `react-native-maps` para mostrar profesionales en el mapa.

**Permisos necesarios:**

- iOS: `NSLocationWhenInUseUsageDescription`
- Android: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`

## 💬 Chat en Tiempo Real

El chat usa Socket.io para comunicación en tiempo real:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: { token: 'JWT_TOKEN' }
});

socket.emit('join_chat', { serviceRequestId });
socket.on('message_received', (message) => {
  // Actualizar UI
});
```

## 🎨 Sistema de Diseño

La app usa un sistema de diseño unificado definido en `src/theme/`:

- **Colores**: Paleta consistente con categorías
- **Tipografía**: Estilos de texto predefinidos
- **Espaciado**: Sistema de espaciado consistente
- **Sombras**: Elevaciones predefinidas

## 🔐 Autenticación y Seguridad

- Tokens JWT almacenados en `Expo Secure Store`
- Refresh token automático en interceptores de axios
- Manejo de sesiones expiradas

## 📦 Build para Producción

### Android (APK/AAB)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Build APK
eas build --platform android --profile preview

# Build AAB para Play Store
eas build --platform android --profile production
```

### iOS (IPA)

```bash
# Build para TestFlight/App Store
eas build --platform ios --profile production
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests (Detox)
npm run test:e2e
```

## 📝 Notas Importantes

### Para Desarrollo

- Usa `__DEV__` para detectar modo desarrollo
- Los logs de Redux están habilitados en desarrollo
- Hot reload está habilitado por defecto

### Para Producción

- Minificar assets
- Habilitar ProGuard (Android)
- Configurar App Store Connect / Google Play Console
- Configurar deep links y universal links

## 🐛 Troubleshooting

### Error: Metro Bundler no inicia

```bash
npm start -- --reset-cache
```

### Error: Maps no se muestra

Verifica que la API Key de Google Maps esté configurada correctamente y tenga Maps SDK habilitado.

### Error: Socket.io no conecta

Verifica la URL del servidor y que el backend esté corriendo.

## 📄 Licencia

MIT

## 👥 Equipo

Desarrollado para FreshApp MVP.
