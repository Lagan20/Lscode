# LsCode - Sistema de Contacto con Vercel

## 🚀 Cambios Realizados

### ✅ Formulario Actualizado
- Cambié el título de "Envíanos un Mensaje" a **"Envíanos un correo"**
- Cambié la etiqueta de "Nombre Completo" a **"Nombre de la Persona o Empresa"**
- Cambié el botón de "Enviar Mensaje" a **"Enviar correo"**
- Removí la tarjeta de información de "Correo Electrónico" del lado derecho

### ✅ Funcionalidades del Correo
- **Asunto personalizado:** "Buenas Ls/Code, Soy/Somos [nombre ingresado]"
- **Destino:** gaffiht.quintero20@gmail.com
- **Remitente:** El correo ingresado por el usuario
- **Contenido:** Exactamente lo que escribe el usuario en el mensaje
- **Confirmación automática:** El usuario recibe un correo confirmando que su mensaje fue enviado

### ✅ Mensajes de Feedback
- Mensaje de **éxito** (verde) cuando se envía correctamente
- Mensaje de **error** (rojo) si algo falla
- El botón muestra "Enviando..." mientras se procesa

---

## 📋 Instrucciones de Configuración en Vercel

### Paso 1: Preparar Gmail

1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. En "Cómo accedes a Google", habilita **"Verificación en dos pasos"** (si no lo has hecho)
3. Vuelve a [Google Account Security](https://myaccount.google.com/security)
4. Desplázate hasta **"Contraseñas de aplicación"**
5. Selecciona:
   - **App:** Correo
   - **Device:** Windows (o tu dispositivo)
6. Google te generará una contraseña de 16 caracteres
7. **Copia esta contraseña** (sin espacios)

### Paso 2: Actualizar archivo .env local

En tu proyecto local, edita el archivo `.env`:

```
GMAIL_PASSWORD=abcd efgh ijkl mnop
```

Reemplaza `abcd efgh ijkl mnop` con la contraseña que generaste.

### Paso 3: Subir a GitHub

```bash
git add .
git commit -m "Actualizar formulario de contacto con función de envío de correos"
git push origin main
```

### Paso 4: Configurar Vercel

1. Ve a tu panel de [Vercel](https://vercel.com)
2. Selecciona tu proyecto `lscode.dev`
3. Ve a **Settings → Environment Variables**
4. Agrega una nueva variable de entorno:
   - **Name:** `GMAIL_PASSWORD`
   - **Value:** La contraseña que copiaste de Google
   - **Environments:** Selecciona Production
5. Haz clic en **Save**

### Paso 5: Redeploy

1. Vuelve a la pestaña **Deployments**
2. Haz clic en los tres puntos del último deployment
3. Selecciona **"Redeploy"**

¡Listo! Tu sitio está actualizado y el formulario de contacto enviará correos.

---

## 📁 Estructura del Proyecto

```
Lscode/
├── index.html              # Página principal actualizada
├── package.json            # Dependencias (solo nodemailer)
├── .env                    # Variables de entorno (local)
├── .gitignore             # Ignora .env en Git
├── vercel.json            # Configuración de Vercel
├── api/
│   └── send-email.js      # Función serverless de Vercel
└── images/                # Carpeta de imágenes
```

---

## 🔧 Cómo Funciona

### Frontend (index.html)
- Usuario llena el formulario
- Hace clic en "Enviar correo"
- JavaScript valida el formulario
- Envía los datos a `/api/send-email`

### Backend (api/send-email.js)
- Recibe los datos del usuario
- Crea dos correos:
  1. **Para LsCode** con asunto "Buenas Ls/Code, Soy/Somos [Nombre]"
  2. **Para el usuario** con confirmación de envío
- Retorna éxito o error

---

## 🧪 Pruebas Locales (Opcional)

Si quieres probar localmente sin Vercel:

1. Instala Node.js desde [nodejs.org](https://nodejs.org)
2. En la carpeta del proyecto:
   ```bash
   npm install
   ```
3. Ejecuta un servidor local:
   ```bash
   npx http-server
   ```
4. Abre en tu navegador: `http://localhost:8080`

---

## ⚠️ Problemas Comunes

### "Configuración de correo no disponible"
- Verifica que añadiste `GMAIL_PASSWORD` en Vercel Settings
- Espera 1-2 minutos después de agregar la variable

### "Gmail rechaza la contraseña"
- Asegúrate de generar una **contraseña de aplicación**, no la contraseña de Gmail
- Copia toda la contraseña de 16 caracteres (incluyendo espacios)
- Si falla, desactiva y reactiva la verificación de dos pasos

### El correo no llega
- Revisa la carpeta de Spam en tu email
- Verifica que el dominio sea `lscode.dev` en Vercel

---

## 📞 Variables del Correo

| Campo | Descripción |
|-------|-------------|
| **Para:** | gaffiht.quintero20@gmail.com |
| **Asunto:** | Buenas Ls/Code, Soy/Somos [nombre] |
| **Remitente:** | El email del usuario |
| **Cuerpo:** | El mensaje exacto que escribió el usuario |
| **Confirmación:** | Se envía automáticamente al usuario |

---

## ✨ Características Implementadas

- ✅ Envío real de correos a través de Gmail
- ✅ Asunto personalizado con el nombre del usuario
- ✅ Confirmación automática al usuario
- ✅ Validación de campos
- ✅ Feedback visual (éxito/error)
- ✅ Función serverless sin costo (Vercel Functions gratis)
- ✅ Seguridad: contraseña no está en el código
- ✅ Responsivo y accesible

---

## 🎯 Próximos Pasos

1. Genera la contraseña de aplicación en Gmail
2. Configura `GMAIL_PASSWORD` en Vercel
3. Haz push a GitHub
4. Redeploy en Vercel
5. ¡Prueba el formulario!
