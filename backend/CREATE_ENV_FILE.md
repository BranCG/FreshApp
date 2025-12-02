# Instrucciones para Crear .env

## ⚠️ IMPORTANTE
El archivo `.env` está protegido por gitignore (correcto para seguridad).
Debes crearlo manualmente siguiendo estos pasos:

## Paso 1: Crear el archivo

En la carpeta `backend`, crea un archivo llamado `.env` (con el punto al inicio).

## Paso 2: Copiar este contenido

```env
# ========================================
# FRESHAPP BACKEND - ENVIRONMENT VARIABLES
# ========================================

# ==================
# DATABASE
# ==================
# Para desarrollo local:
DATABASE_URL=postgresql://postgres:password@localhost:5432/freshapp?schema=public

# Para Render (reemplaza con tu Internal Database URL):
# DATABASE_URL=postgresql://usuario:password@host.oregon-postgres.render.com/freshapp

# ==================
# JWT AUTHENTICATION
# ==================
# ✅ Secrets ya generados - COPIAR TAL CUAL
JWT_SECRET=3eb6f2396410f401daf84cb697a8be643c2f0d3d82cf598376d4d82468b24fc6151db1ab7f4548d7780259f97588d93038759762d05587e44528da210e7058f4
JWT_REFRESH_SECRET=57e6c2a4f6c2406ef1db19bedec66ea92fff2609602054d87c25d4c8601ec4716beff3e59e65e091bdfe0090783d1bed44485c8a94e04c75c0da395ae8451150
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ==================
# MERCADOPAGO (Payments)
# ==================
MERCADOPAGO_ACCESS_TOKEN=TEST-your_access_token_here
MERCADOPAGO_PUBLIC_KEY=TEST-your_public_key_here
PLATFORM_COMMISSION_PERCENTAGE=10

# ==================
# AWS S3 (File Storage) - Opcional
# ==================
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=freshapp-uploads

# ==================
# GOOGLE MAPS
# ==================
GOOGLE_MAPS_API_KEY=AIzaSyAdjscNWb-k04av6fLuMC81uGcVWWsM5sw

# ==================
# FIREBASE (Push Notifications) - Opcional
# ==================
FCM_SERVER_KEY=your_firebase_server_key_here

# ==================
# TWILIO (SMS/OTP) - Opcional
# ==================
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ==================
# CORS & FRONTEND
# ==================
FRONTEND_URL=*
SOCKET_CORS_ORIGIN=*

# ==================
# SERVER CONFIGURATION
# ==================
NODE_ENV=development
PORT=3000
```

## Paso 3: Comando Rápido (PowerShell)

Copia y pega este comando en PowerShell dentro de la carpeta `backend`:

```powershell
@"
DATABASE_URL=postgresql://postgres:password@localhost:5432/freshapp?schema=public
JWT_SECRET=3eb6f2396410f401daf84cb697a8be643c2f0d3d82cf598376d4d82468b24fc6151db1ab7f4548d7780259f97588d93038759762d05587e44528da210e7058f4
JWT_REFRESH_SECRET=57e6c2a4f6c2406ef1db19bedec66ea92fff2609602054d87c25d4c8601ec4716beff3e59e65e091bdfe0090783d1bed44485c8a94e04c75c0da395ae8451150
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
MERCADOPAGO_ACCESS_TOKEN=TEST-your_access_token_here
MERCADOPAGO_PUBLIC_KEY=TEST-your_public_key_here
PLATFORM_COMMISSION_PERCENTAGE=10
GOOGLE_MAPS_API_KEY=AIzaSyAdjscNWb-k04av6fLuMC81uGcVWWsM5sw
FRONTEND_URL=*
SOCKET_CORS_ORIGIN=*
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath .env -Encoding UTF8
```

## ✅ Verificar

Después de crear el archivo, verifica que existe:
```powershell
ls .env
```

## 🚀 Siguiente Paso

Una vez creado el `.env`, continúa con:
```bash
npm install
npx prisma generate
```
