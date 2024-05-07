"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.emailConfig = {
    host: 'smtp.gmail.com', // Cambia esto al servidor SMTP que estés utilizando
    port: 587, // Cambia esto al puerto SMTP correspondiente
    secure: false,
    requireTLS: true,
    user: 'manuelf.borrego@gmail.com', // Cambia esto a tu dirección de correo electrónico
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
//# sourceMappingURL=mailer.js.map