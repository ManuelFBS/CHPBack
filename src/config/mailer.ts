import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'manuelf.borrego@gmail.com',
    pass: process.env.GKEY,
  },
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
});
