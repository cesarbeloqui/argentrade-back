import nodemailer from "nodemailer";
import "dotenv/config";

// Configura el transporte con el servidor SMTP
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT_EMAIL,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.USER, // Reemplaza con tu dirección de correo
    pass: process.env.PASS, // Reemplaza con tu contraseña
    },
  tls: {
    rejectUnauthorized: false,
  },

});

// Función para enviar un correo
const sendEmail = async (mail) => {
  try {
    const info = await transporter.sendMail(mail);
    console.log("Correo enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error; // Lanza el error para que pueda ser manejado en otro lugar
  }
};

export default sendEmail;
