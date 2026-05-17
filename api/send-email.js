import nodemailer from 'nodemailer';

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

        // Obtener la contraseña de la variable de entorno
        const gmailPassword = process.env.GMAIL_PASSWORD;
        if (!gmailPassword) {
            return res.status(500).json({ 
                error: 'Configuración de correo no disponible' 
            });
        }

        // Crear el transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gaffiht.quintero20@gmail.com',
                pass: gmailPassword
            }
        });

        // Crear el asunto personalizado
        const subject = `Buenas Ls/Code, Soy/Somos ${senderName}`;

        // Enviar correo a LsCode
        await transporter.sendMail({
            from: 'gaffiht.quintero20@gmail.com',
            to: recipientEmail,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0066ff;">Nuevo mensaje de contacto</h2>
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong style="color: #0066ff;">Nombre/Empresa:</strong></p>
                        <p>${senderName}</p>
                        
                        <p style="margin-top: 15px;"><strong style="color: #0066ff;">Correo del remitente:</strong></p>
                        <p><a href="mailto:${senderEmail}">${senderEmail}</a></p>
                        
                        <p style="margin-top: 15px;"><strong style="color: #0066ff;">Mensaje:</strong></p>
                        <p style="white-space: pre-wrap; word-wrap: break-word;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;"><em>Este correo fue enviado desde el formulario de contacto en lscode.dev</em></p>
                </div>
            `,
            replyTo: senderEmail
        });

        // Enviar confirmación al usuario
        await transporter.sendMail({
            from: 'gaffiht.quintero20@gmail.com',
            to: senderEmail,
            subject: 'Confirmación: Tu mensaje fue enviado ✓',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0066ff;">Hola ${senderName},</h2>
                    <p>Gracias por contactarnos. Hemos recibido tu mensaje correctamente.</p>
                    
                    <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong style="color: #0066ff;">Detalles de tu mensaje:</strong></p>
                        <p><strong>Asunto:</strong> ${subject}</p>
                        <p><strong style="margin-top: 15px;">Tu mensaje:</strong></p>
                        <p style="white-space: pre-wrap; word-wrap: break-word;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </div>
                    
                    <p style="margin-top: 20px;">Nos pondremos en contacto contigo pronto.</p>
                    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;"><strong>LsCode</strong><br>Desarrollo Web, Apps Móviles y Sistemas Empresariales<br><a href="https://lscode.dev">lscode.dev</a></p>
                </div>
            `
        });

        // Respuesta exitosa
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
