export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Solo aceptar solicitudes POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { senderName, senderEmail, message, recipientEmail } = req.body;

        // Validar los campos requeridos
        if (!senderName || !senderEmail || !message || !recipientEmail) {
            return res.status(400).json({ error: 'Campos requeridos faltantes' });
        }

        // Validar el formato del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(senderEmail)) {
            return res.status(400).json({ error: 'Correo del remitente inválido' });
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
            return res.status(500).json({ 
                error: 'Configuración de correo no disponible en el servidor' 
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
        return res.status(200).json({ 
            success: true, 
            message: 'Correo enviado exitosamente' 
        });

    } catch (error) {
        console.error('Error al enviar correo:', error.message, error);
        return res.status(500).json({ 
            error: 'Error al enviar el correo. Intenta de nuevo más tarde.' 
        });
    }
}
