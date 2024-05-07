import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: 'smtp.gmail.com', // Cambia esto al servidor SMTP que estés utilizando
  port: 587, // Cambia esto al puerto SMTP correspondiente
  secure: false,
  requireTLS: true,
  user: 'oteroalan06@gmail.com', // Cambia esto a tu dirección de correo electrónico
  password: process.env.GKEY, // Cambia esto a tu contraseña
};

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// export const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 587,
//   secure: true,
//   auth: {
//     user: 'manuelf.borrego@gmail.com',
//     pass: process.env.GKEY,
//   },
// });

// transporter.verify().then(() => {
//   console.log('Ready for send emails');
// });
