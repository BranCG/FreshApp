# Guía de Deployment en Render - FreshApp Backend

Esta guía te llevará paso a paso para deployar el backend de FreshApp en Render.

## 📋 Requisitos Previos

- Cuenta en [Render](https://render.com) (plan gratuito disponible)
- Código del backend en un repositorio Git (GitHub, GitLab, o Bitbucket)
- Credenciales de servicios externos (MercadoPago, AWS S3, etc.)

---

## 🚀 Paso 1: Preparar el Repositorio

### 1.1 Verificar Archivos Necesarios

Asegúrate de que tu repositorio tenga estos archivos:

- ✅ `backend/package.json` con script `build` y `start`
- ✅ `backend/tsconfig.json` para compilación TypeScript
- ✅ `backend/.env.example` como referencia
- ✅ `backend/prisma/schema.prisma` para la base de datos
- ✅ `render.yaml` (opcional, para Infrastructure as Code)

### 1.2 Commit y Push

```bash
git add .
git commit -m "Preparar backend para deployment en Render"
git push origin main
```

---

## 🗄️ Paso 2: Crear Base de Datos PostgreSQL

### 2.1 En Render Dashboard

1. Ve a https://dashboard.render.com
2. Click en **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `freshapp-db`
   - **Database**: `freshapp`
   - **User**: `freshapp` (auto-generado)
   - **Region**: Elige el más cercano (ej: Oregon)
   - **Plan**: Free (o el que prefieras)

4. Click **"Create Database"**

### 2.2 Obtener Connection String

Una vez creada la base de datos:

1. Ve a la página de la base de datos
2. Copia el **"Internal Database URL"** (no el External)
3. Guárdalo para el siguiente paso

Ejemplo:
```
postgresql://freshapp:xxxxx@dpg-xxxxx-a.oregon-postgres.render.com/freshapp
```

---

## 🌐 Paso 3: Crear Web Service

### 3.1 Crear Servicio

1. En Render Dashboard, click **"New +"** → **"Web Service"**
2. Conecta tu repositorio Git
3. Selecciona el repositorio de FreshApp

### 3.2 Configuración Básica

- **Name**: `freshapp-backend`
- **Region**: Mismo que la base de datos (ej: Oregon)
- **Branch**: `main` (o la que uses)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && npx prisma generate && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```
- **Plan**: Free (o el que prefieras)

### 3.3 Variables de Entorno

Click en **"Advanced"** → **"Add Environment Variable"**

Agrega las siguientes variables:

#### Variables Obligatorias

| Key | Value | Notas |
|-----|-------|-------|
| `NODE_ENV` | `production` | Entorno de producción |
| `DATABASE_URL` | `[Internal Database URL]` | Copiar de Paso 2.2 |
| `JWT_SECRET` | `[generar random]` | Ver instrucciones abajo |
| `JWT_REFRESH_SECRET` | `[generar random]` | Ver instrucciones abajo |
| `JWT_EXPIRES_IN` | `15m` | Expiración del token |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Expiración del refresh token |
| `FRONTEND_URL` | `*` | Permitir todas las apps móviles |
| `SOCKET_CORS_ORIGIN` | `*` | Permitir WebSocket desde móvil |
| `PLATFORM_COMMISSION_PERCENTAGE` | `10` | Comisión de la plataforma |

#### Generar JWT Secrets

En tu terminal local:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Ejecuta dos veces para generar `JWT_SECRET` y `JWT_REFRESH_SECRET`.

#### Variables de Servicios Externos (Agregar según disponibilidad)

| Key | Descripción | Dónde obtener |
|-----|-------------|---------------|
| `MERCADOPAGO_ACCESS_TOKEN` | Token de MercadoPago | https://www.mercadopago.com.ar/developers |
| `MERCADOPAGO_PUBLIC_KEY` | Public key de MercadoPago | Mismo lugar |
| `AWS_ACCESS_KEY_ID` | AWS Access Key | AWS IAM Console |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | AWS IAM Console |
| `AWS_REGION` | Región de S3 | Ej: `us-east-1` |
| `AWS_S3_BUCKET` | Nombre del bucket | Ej: `freshapp-uploads` |
| `GOOGLE_MAPS_API_KEY` | API Key de Google Maps | https://console.cloud.google.com |
| `FCM_SERVER_KEY` | Firebase Server Key | Firebase Console |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID (opcional) | https://www.twilio.com/console |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token (opcional) | Mismo lugar |
| `TWILIO_PHONE_NUMBER` | Número de Twilio (opcional) | Ej: `+1234567890` |

### 3.4 Health Check

- **Health Check Path**: `/health`

### 3.5 Crear Servicio

Click **"Create Web Service"**

---

## ⏳ Paso 4: Esperar el Deploy

Render comenzará a:
1. ✅ Clonar el repositorio
2. ✅ Instalar dependencias (`npm install`)
3. ✅ Generar Prisma Client (`npx prisma generate`)
4. ✅ Compilar TypeScript (`npm run build`)
5. ✅ Iniciar el servidor (`npm start`)

Esto puede tomar **5-10 minutos** en el primer deploy.

### 4.1 Monitorear Logs

En la página del servicio, ve a la pestaña **"Logs"** para ver el progreso.

Deberías ver:
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en puerto 10000
📍 API URL: https://freshapp-backend.onrender.com/api
🌍 Entorno: production
```

---

## 🔧 Paso 5: Ejecutar Migraciones

### 5.1 Opción A: Desde Render Shell

1. En la página del servicio, click en **"Shell"** (arriba a la derecha)
2. Ejecuta:
   ```bash
   cd /opt/render/project/src
   npx prisma migrate deploy
   ```

### 5.2 Opción B: Agregar al Build Command

Modifica el Build Command para incluir migraciones:
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

⚠️ **Nota**: Esto ejecutará migraciones en cada deploy.

---

## ✅ Paso 6: Verificar el Deployment

### 6.1 Obtener URL

Render te dará una URL como:
```
https://freshapp-backend.onrender.com
```

### 6.2 Probar Health Check

En tu navegador o con curl:
```bash
curl https://freshapp-backend.onrender.com/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T...",
  "environment": "production"
}
```

### 6.3 Probar API

```bash
curl https://freshapp-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## 📱 Paso 7: Conectar la App Móvil

### 7.1 Actualizar URL en Mobile App

Edita `mobile/src/config/environment.ts`:

```typescript
const ENV = {
  // ...
  prod: {
    apiUrl: 'https://freshapp-backend.onrender.com/api',
    socketUrl: 'https://freshapp-backend.onrender.com',
  },
};
```

### 7.2 Rebuild la App

```bash
cd mobile
npm start
```

O para Development Build:
```bash
eas build --profile development --platform android
```

---

## 🔄 Paso 8: Auto-Deploy (Opcional)

Render puede hacer auto-deploy cuando hagas push a tu repositorio.

### 8.1 Configurar Auto-Deploy

1. En la página del servicio, ve a **"Settings"**
2. En **"Build & Deploy"**, asegúrate que **"Auto-Deploy"** esté en **"Yes"**
3. Selecciona la rama (ej: `main`)

Ahora cada push a `main` hará un nuevo deploy automáticamente.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

**Solución**:
1. Verifica que `DATABASE_URL` esté correcta
2. Usa el **Internal Database URL**, no el External
3. Asegúrate que la base de datos esté en la misma región

### Error: "Prisma Client not generated"

**Solución**:
Agrega `npx prisma generate` al Build Command:
```bash
npm install && npx prisma generate && npm run build
```

### Error: "Port already in use"

**Solución**:
Render asigna el puerto automáticamente. Asegúrate que tu código use:
```typescript
const PORT = process.env.PORT || 3000;
```

### Error: "CORS policy blocked"

**Solución**:
1. Verifica que `FRONTEND_URL=*` esté en las variables de entorno
2. Verifica que el código tenga:
   ```typescript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true,
   }));
   ```

### App móvil no conecta

**Solución**:
1. Verifica que la URL en `environment.ts` sea correcta
2. Prueba el health check desde el navegador
3. Revisa los logs de Render
4. Asegúrate que CORS esté configurado correctamente

---

## 📊 Monitoreo

### Logs en Tiempo Real

En Render Dashboard → Tu servicio → **"Logs"**

### Métricas

En Render Dashboard → Tu servicio → **"Metrics"**

Puedes ver:
- CPU usage
- Memory usage
- Request count
- Response times

---

## 💰 Costos

### Plan Free

- ✅ 750 horas/mes de compute (suficiente para 1 servicio 24/7)
- ✅ PostgreSQL con 1GB storage
- ⚠️ El servicio se "duerme" después de 15 minutos de inactividad
- ⚠️ Primer request después de dormir toma ~30 segundos

### Mantener Activo (Opcional)

Usa un servicio como [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos:
```
https://freshapp-backend.onrender.com/health
```

---

## 🎉 ¡Listo!

Tu backend de FreshApp está deployado en Render y listo para recibir requests desde la app móvil.

**URL de tu API**: `https://freshapp-backend.onrender.com/api`

### Próximos Pasos

1. ✅ Configurar servicios externos (MercadoPago, AWS S3, etc.)
2. ✅ Crear usuarios de prueba
3. ✅ Probar flujos completos desde la app móvil
4. ✅ Configurar dominio personalizado (opcional)
5. ✅ Configurar SSL (Render lo hace automáticamente)

---

## 📚 Recursos

- [Documentación de Render](https://render.com/docs)
- [Render + Node.js](https://render.com/docs/deploy-node-express-app)
- [Render + PostgreSQL](https://render.com/docs/databases)
- [Prisma + Render](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
