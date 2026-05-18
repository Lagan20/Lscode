export default async function handler(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    // Solo aceptar solicitudes POST
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método no permitido' }), {
            status: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const body = await request.json();
        const { senderName, senderEmail, message, recipientEmail } = body;

        // Validar los campos requeridos
         if (!senderName || !senderEmail || !message || !recipientEmail) {
             return new Response(JSON.stringify({ error: 'Campos requeridos faltantes' }), {
                 status: 400,
                 headers: {
                     'Access-Control-Allow-Origin': '*',
                     'Content-Type': 'application/json',
                 },
             });
         }
 
         // Validar el formato del correo
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(senderEmail)) {
             return new Response(JSON.stringify({ error: 'Correo del remitente inválido' }), {
                 status: 400,
                 headers: {
                     'Access-Control-Allow-Origin': '*',
                     'Content-Type': 'application/json',
                 },
             });
         }

        // Obtener credenciales de variables de entorno
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;

        console.log('Environment variables check:', {
            serviceId: !!serviceId,
            templateId: !!templateId,
            publicKey: !!publicKey
        });

        if (!serviceId || !templateId || !publicKey) {
             console.error('Missing environment variables');
             return new Response(JSON.stringify({ 
                 error: 'Configuración de correo no disponible en el servidor' 
             }), {
                 status: 500,
                 headers: {
                     'Access-Control-Allow-Origin': '*',
                     'Content-Type': 'application/json',
                 },
             });
         }

        // Crear el asunto personalizado
        const subject = `Buenas Ls/Code, Soy/Somos ${senderName}`;

        // Template para el correo a LsCode
        const templateParams = {
            to_email: recipientEmail,
            subject: subject,
            sender_name: senderName,
            sender_email: senderEmail,
            message: message,
            reply_to: senderEmail
        };

        console.log('Sending email to EmailJS API');

        // Enviar correo a LsCode usando EmailJS API
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                template_params: templateParams
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('EmailJS API error:', response.status, errorText);
            throw new Error('Error enviando correo a LsCode');
        }

        console.log('Email sent successfully to LsCode');

        // Enviar confirmación al usuario
        const confirmationParams = {
            to_email: senderEmail,
            subject: 'Confirmación: Tu mensaje fue enviado ✓',
            sender_name: senderName,
            sender_email: senderEmail,
            message: message,
            is_confirmation: true
        };

        const confirmResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                template_params: confirmationParams
            })
        });

        if (!confirmResponse.ok) {
            const confirmErrorText = await confirmResponse.text();
            console.warn('Advertencia: correo de confirmación no enviado', confirmErrorText);
        } else {
            console.log('Confirmation email sent to user');
        }

         // Respuesta exitosa
         return new Response(JSON.stringify({ 
             success: true, 
             message: 'Correo enviado exitosamente' 
         }), {
             status: 200,
             headers: {
                 'Access-Control-Allow-Origin': '*',
                 'Content-Type': 'application/json',
             },
         });

    } catch (error) {
        console.error('Error al enviar correo:', error.message, error);
        return res.status(500).json({ 
            error: 'Error al enviar el correo. Intenta de nuevo más tarde.' 
        });
    }
}
