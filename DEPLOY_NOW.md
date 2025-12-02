# 🚀 Guía Rápida de Deployment a Render

## ✅ Completado Hasta Ahora

- [x] Dependencias de mobile instaladas (950 packages)
- [x] Dependencias de backend instaladas (629 packages)
- [x] JWT Secrets generados
- [x] Configuración de ambiente lista

## 📋 Próximos Pasos

### Paso 1: Crear archivo .env (REQUERIDO)

El archivo `.env` está protegido por gitignore. Debes crearlo manualmente:

**Opción A - Comando Rápido (PowerShell)**:
```powershell
cd backend

@"
DATABASE_URL=postgresql://postgres:password@localhost:5432/freshapp?schema=public
JWT_SECRET=3eb6f2396410f401daf84cb697a8be643c2f0d3d82cf598376d4d82468b24fc6151db1ab7f4548d7780259f97588d93038759762d05587e44528da210e7058f4
JWT_REFRESH_SECRET=57e6c2a4f6c2406ef1db19bedec66ea92fff2609602054d87c25d4c8601ec4716beff3e59e65e091bdfe0090783d1bed44485c8a94e04c75c0da395ae8451150
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=*
SOCKET_CORS_ORIGIN=*
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath .env -Encoding UTF8
```

**Opción B - Manual**:
Ver instrucciones completas en: [CREATE_ENV_FILE.md](file:///c:/Users/brand/Desktop/FreshApp-main/backend/CREATE_ENV_FILE.md)

---

### Paso 2: Deploy Backend a Render

#### 2.1 Crear Cuenta en Render
1. Ve a https://render.com
2. Regístrate con GitHub (recomendado)

#### 2.2 Crear PostgreSQL Database
1. En Dashboard → **New +** → **PostgreSQL**
2. Configuración:
   - Name: `freshapp-db`
   - Database: `freshapp`
   - Region: Oregon (o el más cercano)
   - Plan: **Free**
3. Click **Create Database**
4. **IMPORTANTE**: Copia el **Internal Database URL** (lo necesitarás después)

#### 2.3 Subir Código a GitHub (si no lo has hecho)

```bash
# Inicializar git (si no está inicializado)
cd c:\Users\brand\Desktop\FreshApp-main
git init
git add .
git commit -m "FreshApp configurado para Render"

# Crear repositorio en GitHub y subir
# (O conecta tu repositorio existente)
```

#### 2.4 Crear Web Service en Render
1. En Dashboard → **New +** → **Web Service**
2. Conecta tu repositorio de GitHub
3. Configuración:
   - **Name**: `freshapp-backend`
   - **Region**: Oregon (mismo que la DB)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables** (Click "Advanced"):
   ```
   NODE_ENV=production
   DATABASE_URL=<pegar Internal Database URL de paso 2.2>
   JWT_SECRET=3eb6f2396410f401daf84cb697a8be643c2f0d3d82cf598376d4d82468b24fc6151db1ab7f4548d7780259f97588d93038759762d05587e44528da210e7058f4
   JWT_REFRESH_SECRET=57e6c2a4f6c2406ef1db19bedec66ea92fff2609602054d87c25d4c8601ec4716beff3e59e65e091bdfe0090783d1bed44485c8a94e04c75c0da395ae8451150
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=*
   SOCKET_CORS_ORIGIN=*
   PLATFORM_COMMISSION_PERCENTAGE=10
   ```

5. Click **Create Web Service**

#### 2.5 Esperar el Deploy
- El primer deploy toma 5-10 minutos
- Monitorea en la pestaña "Logs"
- Cuando veas "🚀 Servidor corriendo..." está listo

#### 2.6 Obtener URL
Tu backend estará en: `https://freshapp-backend-XXXX.onrender.com`

---

### Paso 3: Ejecutar Migraciones

Una vez que el backend esté deployado:

1. En Render Dashboard → Tu servicio → **Shell** (arriba a la derecha)
2. Ejecuta:
   ```bash
   npx prisma migrate deploy
   ```

---

### Paso 4: Actualizar Mobile App

Edita `mobile/src/config/environment.ts`:

```typescript
const ENV = {
  dev: {
    apiUrl: 'https://TU-URL-DE-RENDER.onrender.com/api',  // ← Cambiar aquí
    socketUrl: 'https://TU-URL-DE-RENDER.onrender.com',
  },
  prod: {
    apiUrl: 'https://TU-URL-DE-RENDER.onrender.com/api',
    socketUrl: 'https://TU-URL-DE-RENDER.onrender.com',
  },
};
```

---

### Paso 5: Crear Development Build

```bash
# Instalar EAS CLI (si no lo tienes)
npm install -g eas-cli

# Login en Expo
eas login

# Crear build para Android
cd mobile
eas build --profile development --platform android
```

Esto toma 10-15 minutos. Al finalizar:
1. Escanea el QR para descargar el APK
2. Instala en tu dispositivo Android
3. Abre la app

---

## 🎯 Verificación

### Backend
```bash
# Probar health check
curl https://TU-URL-DE-RENDER.onrender.com/health
```

Deberías ver:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

### Mobile
1. Abre la app instalada
2. Debería conectarse automáticamente
3. Verás la pantalla de login/registro

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verifica que usaste el **Internal Database URL** (no External)
- Asegúrate que la DB y el servicio estén en la misma región

### "CORS error"
- Verifica que `FRONTEND_URL=*` esté en las variables de entorno de Render

### "Build failed"
- Revisa los logs en Render Dashboard
- Asegúrate que el Build Command sea correcto

### App no conecta
- Verifica la URL en `environment.ts`
- Prueba el health check desde el navegador
- Asegúrate que el backend esté corriendo

---

## 📚 Documentación Completa

Para más detalles, consulta:
- [RENDER_DEPLOYMENT.md](file:///c:/Users/brand/Desktop/FreshApp-main/docs/RENDER_DEPLOYMENT.md) - Guía completa de Render
- [EAS_BUILD_GUIDE.md](file:///c:/Users/brand/Desktop/FreshApp-main/docs/EAS_BUILD_GUIDE.md) - Guía completa de EAS Build
- [QUICK_START.md](file:///c:/Users/brand/Desktop/FreshApp-main/docs/QUICK_START.md) - Inicio rápido

---

## ✅ Checklist

- [ ] Crear archivo `.env` en backend
- [ ] Crear cuenta en Render
- [ ] Crear PostgreSQL database
- [ ] Subir código a GitHub
- [ ] Crear Web Service en Render
- [ ] Configurar variables de entorno
- [ ] Esperar deploy
- [ ] Ejecutar migraciones
- [ ] Actualizar URL en mobile
- [ ] Crear Development Build
- [ ] Instalar y probar app

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tendrás:
- ✅ Backend corriendo en Render 24/7
- ✅ App móvil funcionando en tu dispositivo
- ✅ Todas las funcionalidades nativas activas
- ✅ Conexión completa entre mobile y backend

**¡Tu FreshApp estará funcionando como FaringoApp!** 🚀
