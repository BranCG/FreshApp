# Guía de EAS Build - FreshApp Mobile

Esta guía te enseñará cómo crear un **Development Build** de FreshApp usando EAS (Expo Application Services) para poder usar todas las funcionalidades nativas en tu dispositivo.

## 🎯 ¿Por qué Development Build?

FreshApp usa plugins nativos que **NO funcionan** con Expo Go estándar:
- 📍 `expo-location` - Geolocalización
- 🔔 `expo-notifications` - Notificaciones push
- 🔐 `expo-secure-store` - Almacenamiento seguro
- 🗺️ `react-native-maps` - Mapas

**Development Build** te permite:
- ✅ Usar todos los plugins nativos
- ✅ Conectar a tu servidor de desarrollo o Render
- ✅ Hot reload como Expo Go
- ✅ Debugging completo

---

## 📋 Requisitos Previos

### Software

- **Node.js** 18+
- **npm** o **yarn**
- **EAS CLI**: 
  ```bash
  npm install -g eas-cli
  ```
- **Expo CLI**:
  ```bash
  npm install -g expo-cli
  ```

### Para Android

- **Android Studio** con Android SDK
- **JDK** 11 o superior
- Dispositivo Android físico o emulador

### Para iOS (solo macOS)

- **Xcode** 14+
- **CocoaPods**
- Dispositivo iOS físico o simulador
- **Cuenta de Apple Developer** (para dispositivos físicos)

### Cuenta Expo

1. Crea una cuenta en https://expo.dev
2. Login en la terminal:
   ```bash
   eas login
   ```

---

## 🚀 Paso 1: Configurar el Proyecto

### 1.1 Instalar Dependencias

```bash
cd mobile
npm install
```

### 1.2 Configurar EAS

Si es la primera vez:

```bash
eas build:configure
```

Esto creará/actualizará `eas.json`.

### 1.3 Verificar app.json

Asegúrate de que `app.json` tenga:

```json
{
  "expo": {
    "name": "FreshApp",
    "slug": "freshapp",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.freshapp"
    },
    "android": {
      "package": "com.freshapp"
    },
    "plugins": [
      "expo-location",
      "expo-notifications",
      "expo-secure-store"
    ]
  }
}
```

---

## 📱 Paso 2: Build para Android

### 2.1 Crear Development Build

```bash
eas build --profile development --platform android
```

Esto:
1. ✅ Sube tu código a Expo
2. ✅ Compila la app con todos los plugins nativos
3. ✅ Genera un APK

### 2.2 Esperar el Build

El build puede tomar **10-20 minutos**. Puedes:
- Ver el progreso en la terminal
- Ver en https://expo.dev/accounts/[tu-usuario]/projects/freshapp/builds

### 2.3 Descargar e Instalar

Una vez completado:

**Opción A: Escanear QR**
1. Escanea el QR que aparece en la terminal
2. Descarga el APK en tu dispositivo
3. Instala (permite "Instalar desde fuentes desconocidas")

**Opción B: Descargar manualmente**
1. Ve a https://expo.dev
2. Busca tu build
3. Descarga el APK
4. Transfiere a tu dispositivo Android
5. Instala

### 2.4 Abrir la App

1. Abre la app "FreshApp" instalada
2. Verás una pantalla de "Expo Go Development"
3. La app se conectará automáticamente a tu servidor de desarrollo

---

## 🍎 Paso 3: Build para iOS (solo macOS)

### 3.1 Requisitos Adicionales

Para dispositivos físicos necesitas:
- Cuenta de Apple Developer ($99/año)
- Certificados y provisioning profiles

Para simulador (gratis):
```bash
eas build --profile development --platform ios
```

### 3.2 Configurar Credenciales

```bash
eas credentials
```

Sigue las instrucciones para:
- Crear certificados
- Crear provisioning profiles
- Registrar dispositivos

### 3.3 Crear Build

```bash
eas build --profile development --platform ios
```

### 3.4 Instalar

**Para Simulador**:
1. Descarga el archivo `.tar.gz`
2. Extrae
3. Arrastra el `.app` al simulador

**Para Dispositivo Físico**:
1. Descarga el archivo `.ipa`
2. Usa Xcode o Apple Configurator para instalar

---

## 🔧 Paso 4: Conectar a tu Backend

### 4.1 Desarrollo Local

Si tu backend corre en `localhost:3000`:

**Android Emulador**:
```typescript
// mobile/src/config/environment.ts
const ENV = {
  dev: {
    apiUrl: 'http://10.0.2.2:3000/api',
    socketUrl: 'http://10.0.2.2:3000',
  },
};
```

**iOS Simulator**:
```typescript
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
    socketUrl: 'http://localhost:3000',
  },
};
```

**Dispositivo Físico**:
```typescript
// Usa la IP de tu computadora
const ENV = {
  dev: {
    apiUrl: 'http://192.168.1.100:3000/api',  // Tu IP local
    socketUrl: 'http://192.168.1.100:3000',
  },
};
```

Para obtener tu IP:
```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
```

### 4.2 Conectar a Render

```typescript
const ENV = {
  dev: {
    apiUrl: 'https://freshapp-backend.onrender.com/api',
    socketUrl: 'https://freshapp-backend.onrender.com',
  },
  prod: {
    apiUrl: 'https://freshapp-backend.onrender.com/api',
    socketUrl: 'https://freshapp-backend.onrender.com',
  },
};
```

---

## 🔄 Paso 5: Desarrollo con Hot Reload

### 5.1 Iniciar Metro Bundler

```bash
cd mobile
npm start
```

### 5.2 Conectar la App

1. Abre la app instalada en tu dispositivo
2. Automáticamente se conectará al bundler
3. Ahora puedes editar código y ver cambios en tiempo real

### 5.3 Debugging

**React Native Debugger**:
1. Instala: https://github.com/jhen0409/react-native-debugger
2. En la app, agita el dispositivo
3. Selecciona "Debug"

**Chrome DevTools**:
1. En la app, agita el dispositivo
2. Selecciona "Debug with Chrome"
3. Abre `chrome://inspect`

---

## 📦 Paso 6: Build de Preview/Production

### 6.1 Preview Build (para testing)

```bash
eas build --profile preview --platform android
```

Esto crea un APK optimizado para testing.

### 6.2 Production Build

```bash
eas build --profile production --platform android
```

Esto crea un AAB (Android App Bundle) para Google Play Store.

Para iOS:
```bash
eas build --profile production --platform ios
```

---

## 🎨 Personalización de Build

### Cambiar Nombre de la App

En `app.json`:
```json
{
  "expo": {
    "name": "FreshApp Pro",
    "slug": "freshapp-pro"
  }
}
```

### Cambiar Ícono

1. Crea un ícono de 1024x1024 PNG
2. Guárdalo en `mobile/assets/icon.png`
3. Actualiza `app.json`:
   ```json
   {
     "expo": {
       "icon": "./assets/icon.png"
     }
   }
   ```

### Cambiar Splash Screen

1. Crea una imagen de splash
2. Guárdala en `mobile/assets/splash.png`
3. Actualiza `app.json`:
   ```json
   {
     "expo": {
       "splash": {
         "image": "./assets/splash.png",
         "backgroundColor": "#6200EE"
       }
     }
   }
   ```

---

## 🐛 Troubleshooting

### Error: "Build failed"

**Solución**:
1. Revisa los logs en https://expo.dev
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate que `app.json` esté correcto

### Error: "Cannot connect to Metro"

**Solución**:
1. Verifica que `npm start` esté corriendo
2. Asegúrate que estés en la misma red WiFi
3. Reinicia Metro: `npm start -- --reset-cache`

### Error: "Module not found"

**Solución**:
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### App se cierra inmediatamente

**Solución**:
1. Revisa los logs: `adb logcat` (Android) o Xcode Console (iOS)
2. Verifica que todos los plugins estén en `app.json`
3. Rebuild la app

### No puedo instalar en dispositivo físico

**Android**:
1. Habilita "Instalar desde fuentes desconocidas"
2. Habilita "Depuración USB"

**iOS**:
1. Necesitas cuenta de Apple Developer
2. Registra tu dispositivo en https://developer.apple.com
3. Crea provisioning profile

---

## 📊 Comparación: Expo Go vs Development Build

| Característica | Expo Go | Development Build |
|----------------|---------|-------------------|
| Plugins nativos | ❌ Limitado | ✅ Todos |
| Hot reload | ✅ Sí | ✅ Sí |
| Debugging | ✅ Sí | ✅ Sí |
| Setup | ✅ Rápido | ⚠️ Requiere build |
| Mapas | ❌ No | ✅ Sí |
| Notificaciones | ❌ Limitado | ✅ Completo |
| Geolocalización | ⚠️ Básico | ✅ Completo |

---

## 🚀 Comandos Útiles

### Ver builds anteriores
```bash
eas build:list
```

### Cancelar build en progreso
```bash
eas build:cancel
```

### Ver configuración
```bash
eas build:configure
```

### Limpiar caché
```bash
npm start -- --reset-cache
```

### Build para ambas plataformas
```bash
eas build --profile development --platform all
```

---

## 💡 Tips

### 1. Usa Internal Distribution

Para compartir con testers sin publicar en stores:

```bash
eas build --profile preview --platform android
```

Comparte el link del build.

### 2. Configura Auto-Submit

En `eas.json`:
```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./path/to/key.json"
      }
    }
  }
}
```

### 3. Usa Diferentes Ambientes

Crea perfiles en `eas.json`:
```json
{
  "build": {
    "staging": {
      "env": {
        "API_URL": "https://staging.freshapp.com"
      }
    }
  }
}
```

---

## 📚 Recursos

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Expo Forums](https://forums.expo.dev/)

---

## 🎉 ¡Listo!

Ahora tienes un Development Build de FreshApp funcionando con todas las capacidades nativas.

### Próximos Pasos

1. ✅ Conectar a tu backend en Render
2. ✅ Probar todas las funcionalidades
3. ✅ Compartir con testers
4. ✅ Preparar para producción
5. ✅ Publicar en stores

**¡Happy coding!** 🚀
