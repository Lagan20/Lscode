export default async function handler(req, res) {
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

        // Obtener credenciales de variables de entorno (SEGURO - Solo en servidor)
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            return res.status(500).json({ 
                error: 'Configuración de correo no disponible' 
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

        // Enviar correo a LsCode usando EmailJS API (DESDE EL SERVIDOR - SEGURO)
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,  // AQUI está el Public Key, pero es SOLO en servidor
                template_params: templateParams
            })
        });

        if (!response.ok) {
            throw new Error('Error enviando correo a LsCode');
        }

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
                user_id: publicKey,  // SEGURO - No se expone al frontend
                template_params: confirmationParams
            })
        });

        if (!confirmResponse.ok) {
            console.warn('Advertencia: correo de confirmación no enviado');
        }

        // Respuesta exitosa (sin exponer las credenciales)
        return res.status(200).json({ 
            success: true, 
            message: 'Correo enviado exitosamente' 
        });

    } catch (error) {
        console.error('Error al enviar correo:', error);
        return res.status(500).json({ 
            error: 'Error al enviar el correo. Intenta de nuevo más tarde.' 
        });
    }
}
