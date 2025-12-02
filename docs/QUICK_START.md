# FreshApp - Guía de Inicio Rápido

Configura y ejecuta FreshApp en **menos de 30 minutos**.

## 🎯 Objetivo

Al final de esta guía tendrás:
- ✅ Backend corriendo en Render
- ✅ App móvil funcionando en tu dispositivo
- ✅ Conexión completa entre mobile y backend

---

## ⚡ Opción A: Testing Rápido (15 minutos)

### Paso 1: Clonar y Configurar

```bash
# Clonar repositorio
git clone <tu-repo-url>
cd FreshApp-main

# Instalar dependencias del backend
cd backend
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales (mínimo: DATABASE_URL, JWT_SECRET)

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar backend
npm run dev
```

### Paso 2: Configurar Mobile

```bash
# En otra terminal
cd mobile
npm install

# Editar src/config/environment.ts
# Cambiar apiUrl a tu IP local o Render URL

# Iniciar app
npm start
```

### Paso 3: Probar en Expo Go

1. Instala **Expo Go** en tu dispositivo (App Store/Play Store)
2. Escanea el QR code
3. ⚠️ **Nota**: Algunas funcionalidades (mapas, ubicación) no funcionarán en Expo Go

---

## 🚀 Opción B: Setup Completo con Render (30 minutos)

### Paso 1: Deploy Backend a Render

Sigue la [Guía de Deployment en Render](./RENDER_DEPLOYMENT.md):

1. Crea cuenta en Render
2. Crea base de datos PostgreSQL
3. Crea Web Service
4. Configura variables de entorno
5. Deploy

**Resultado**: Backend corriendo en `https://tu-app.onrender.com`

### Paso 2: Configurar Mobile para Render

```bash
cd mobile
npm install
```

Edita `src/config/environment.ts`:
```typescript
const ENV = {
  dev: {
    apiUrl: 'https://tu-app.onrender.com/api',
    socketUrl: 'https://tu-app.onrender.com',
  },
  prod: {
    apiUrl: 'https://tu-app.onrender.com/api',
    socketUrl: 'https://tu-app.onrender.com',
  },
};
```

### Paso 3: Crear Development Build

Sigue la [Guía de EAS Build](./EAS_BUILD_GUIDE.md):

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Crear build para Android
eas build --profile development --platform android

# Esperar ~15 minutos
# Descargar e instalar APK en tu dispositivo
```

### Paso 4: Conectar y Probar

1. Abre la app instalada
2. Inicia Metro bundler: `npm start`
3. La app se conectará automáticamente
4. ¡Prueba todas las funcionalidades!

---

## 📱 URLs Importantes

Una vez deployado, tendrás:

- **Backend API**: `https://tu-app.onrender.com/api`
- **Health Check**: `https://tu-app.onrender.com/health`
- **Prisma Studio**: Ejecuta `npx prisma studio` localmente
- **EAS Builds**: https://expo.dev

---

## 🔑 Variables de Entorno Mínimas

### Backend (.env)

```env
# Obligatorias
DATABASE_URL=postgresql://...
JWT_SECRET=<generar-random>
JWT_REFRESH_SECRET=<generar-random>
FRONTEND_URL=*
SOCKET_CORS_ORIGIN=*

# Opcionales (para funcionalidad completa)
MERCADOPAGO_ACCESS_TOKEN=TEST-...
GOOGLE_MAPS_API_KEY=...
AWS_ACCESS_KEY_ID=...
FCM_SERVER_KEY=...
```

Generar secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Verificación

### Backend

```bash
# Health check
curl https://tu-app.onrender.com/health

# Debería responder:
# {"status":"ok","timestamp":"...","environment":"production"}
```

### Mobile

1. Abre la app
2. Deberías ver la pantalla de login/registro
3. Intenta registrarte
4. Verifica que la conexión funcione

---

## 🐛 Problemas Comunes

### "Cannot connect to backend"

**Solución**:
1. Verifica que backend esté corriendo
2. Verifica la URL en `environment.ts`
3. Prueba el health check desde el navegador

### "Build failed" en EAS

**Solución**:
1. Verifica que `app.json` esté correcto
2. Asegúrate que todas las dependencias estén instaladas
3. Revisa los logs en expo.dev

### "Database connection failed"

**Solución**:
1. Verifica `DATABASE_URL` en Render
2. Usa el **Internal Database URL**
3. Ejecuta migraciones: `npx prisma migrate deploy`

### "CORS error"

**Solución**:
1. Verifica que `FRONTEND_URL=*` en Render
2. Reinicia el servicio en Render

---

## 📚 Documentación Completa

- 📖 [Guía de Instalación Completa](./SETUP.md)
- 🚀 [Deployment en Render](./RENDER_DEPLOYMENT.md)
- 📱 [EAS Build Guide](./EAS_BUILD_GUIDE.md)
- 🏗️ [Arquitectura](./ARCHITECTURE.md)
- 🔌 [API Documentation](./API.md)

---

## 🎯 Próximos Pasos

### Para Desarrollo

1. ✅ Familiarízate con el código
2. ✅ Lee la documentación de API
3. ✅ Prueba los flujos de usuario
4. ✅ Configura servicios externos (MercadoPago, etc.)

### Para Producción

1. ✅ Configura dominio personalizado
2. ✅ Agrega todas las credenciales de servicios
3. ✅ Ejecuta tests
4. ✅ Crea builds de producción
5. ✅ Publica en stores

---

## 💡 Tips

### Desarrollo Rápido

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Mobile
cd mobile && npm start

# Terminal 3: Prisma Studio (opcional)
cd backend && npx prisma studio
```

### Mantener Render Activo

Usa [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos:
```
https://tu-app.onrender.com/health
```

Esto evita que el servicio se "duerma" en el plan free.

### Hot Reload

Con Development Build, puedes editar código y ver cambios instantáneamente sin rebuild.

---

## 🆘 Ayuda

Si tienes problemas:

1. 📖 Revisa la documentación completa
2. 🔍 Busca en los logs (Render Dashboard o terminal)
3. 🐛 Revisa la sección de Troubleshooting
4. 💬 Contacta al equipo de desarrollo

---

## 🎉 ¡Listo!

Ahora tienes FreshApp funcionando. ¡Empieza a desarrollar! 🚀

**Comandos útiles**:
```bash
# Ver logs de Render
# (En Render Dashboard)

# Rebuild mobile
cd mobile && npm start -- --reset-cache

# Rebuild backend
cd backend && npm run build

# Ver base de datos
cd backend && npx prisma studio
```
