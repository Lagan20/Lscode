# 🎯 GUÍA RÁPIDA: CONFIGURAR FORMULARIO DE CONTACTO

## Pasos para que funcione en https://lscode.dev

---

## ✅ PASO 1: Generar Contraseña en Gmail (5 min)

### Opción A: Si ya tienes autenticación de dos factores habilitada
1. Ve a: https://myaccount.google.com/security
2. Desplázate hasta "Contraseñas de aplicación"
3. Si no ves esta opción, primero habilita "Verificación en dos pasos"

### Opción B: Si necesitas habilitar autenticación de dos factores
1. Ve a: https://myaccount.google.com/security
2. En la sección "Cómo accedes a Google"
3. Haz clic en "Verificación en dos pasos"
4. Sigue el proceso (necesitas tu teléfono)
5. Una vez listo, ve a "Contraseñas de aplicación"

### Generar la contraseña
1. En "Contraseñas de aplicación", selecciona:
   - **App:** Correo
   - **Device:** Windows (o tu dispositivo)
2. Click en "Generar"
3. **Copia la contraseña de 16 caracteres** (incluyendo espacios)
   
   ⚠️ Ejemplo: `abcd efgh ijkl mnop`

---

## ✅ PASO 2: Agregar a Variables de Entorno en Vercel

### En https://vercel.com

1. Selecciona tu proyecto "lscode"
2. Ve a **Settings** → **Environment Variables**
3. Click en **Add New**
4. Completa:
   - **Name:** `GMAIL_PASSWORD`
   - **Value:** Pega la contraseña que copiaste
   - **Environments:** Selecciona ✓ Production
5. Click en **Add**
6. Click en **Save**

⏰ **Espera 1-2 minutos** (Vercel necesita procesar la variable)

---

## ✅ PASO 3: Hacer Push a GitHub

En tu terminal o Git Bash:

```bash
cd "C:\Users\USER\Desktop\Lscode"
git push origin main
```

---

## ✅ PASO 4: Redeploy en Vercel

### Opción A: Automático (Vercel detecta el push)
- Vercel automáticamente redeploy en 1-2 minutos

### Opción B: Manual
1. Ve a https://vercel.com/projects/lscode
2. En **Deployments**, busca el último
3. Haz clic en los **3 puntos** ⋯
4. Selecciona **Redeploy**

---

## ✅ PASO 5: Probar el Formulario

1. Ve a https://lscode.dev
2. Desplázate a la sección "Contáctanos"
3. Llena el formulario:
   - Nombre de la Persona o Empresa: `Prueba Usuario`
   - Tu Correo Electrónico: Tu email personal
   - Tu Mensaje: `Este es un mensaje de prueba`
4. Click en "Enviar correo"

### ¿Qué debería pasar?
- ✅ El botón dice "Enviando..."
- ✅ Aparece mensaje verde: "Mensaje enviado exitosamente"
- ✅ Recibes DOS correos:
  
  **Correo 1** (En tu email):
  - De: gaffiht.quintero20@gmail.com
  - Asunto: "Confirmación: Tu mensaje fue enviado ✓"
  - Contenido: Resumen de tu mensaje
  
  **Correo 2** (En tu correo de producción):
  - De: gaffiht.quintero20@gmail.com  
  - Asunto: "Buenas Ls/Code, Soy/Somos Prueba Usuario"
  - Contenido: Tu mensaje completo

---

## ❌ TROUBLESHOOTING

### El formulario muestra error

#### Error: "Configuración de correo no disponible"
- ❌ La variable `GMAIL_PASSWORD` no está configurada en Vercel
- ✅ Solución: Revisa que agregaste la variable en Settings → Environment Variables
- ✅ Espera 2 minutos y prueba de nuevo

#### Error: "Error de conexión"
- ❌ La función serverless no se está ejecutando
- ✅ Solución: Verifica que hiciste push a GitHub
- ✅ Espera a que Vercel termine el redeploy (2-3 min)
- ✅ Recarga la página (Ctrl+Shift+R para limpiar caché)

#### Gmail rechaza la contraseña
- ❌ La contraseña no es correcta
- ✅ Solución: Asegúrate de generar "Contraseña de aplicación" NO la contraseña de Gmail
- ✅ Verifica que copiaste TODA la contraseña (16 caracteres)
- ✅ Si sigue fallando, desactiva y reactiva verificación de dos pasos

#### El correo no llega
- ❌ Revisa tu carpeta de SPAM
- ✅ Si no está allí, verifica que en Vercel el redeploy terminó
- ✅ Mira la consola del navegador (F12) para ver errores

---

## 📞 ¿QUÉ CORREOS RECIBE CADA PERSONA?

### Usuario que llena el formulario
```
Recibe: 1 correo de confirmación
De: gaffiht.quintero20@gmail.com
Asunto: Confirmación: Tu mensaje fue enviado ✓
```

### Tu email (gaffiht.quintero20@gmail.com)
```
Recibe: 1 correo con el mensaje del usuario
De: gaffiht.quintero20@gmail.com
Asunto: Buenas Ls/Code, Soy/Somos [Nombre del usuario]
```

---

## 🔒 SEGURIDAD

✅ La contraseña NO está en el código
✅ La contraseña NO se ve en Git  
✅ La contraseña está SOLO en variables de entorno de Vercel
✅ Si alguien se la roba, puedes revocarla en Google sin problema

---

## 📊 VARIABLES DE ENTORNO EN VERCEL

Tu proyecto necesita esta variable:

| Variable | Valor |
|----------|-------|
| `GMAIL_PASSWORD` | Tu contraseña de aplicación de 16 caracteres |

Eso es todo. No necesitas más variables.

---

## ✨ FINAL

Listo. Tu formulario:
- ✅ Está actualizado en el código
- ✅ Se verá mejor ("Envíanos un correo")
- ✅ Enviará correos de verdad
- ✅ Enviará confirmación al usuario
- ✅ Estará en producción en lscode.dev

**Tiempo total: 10-15 minutos** ⏱️

---

## 💡 TIPS

- La contraseña de aplicación es diferente a tu contraseña de Gmail
- Puedes crear varias contraseñas de aplicación (una por dispositivo/app)
- Si cambias la contraseña en Google, debes actualizar en Vercel
- Vercel guarda las variables de forma segura y encriptada

---

**¿Preguntas?** Revisa el archivo `README.md` para más detalles.
