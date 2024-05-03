import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'manuelf.borrego@gmail.com',
    pass: process.env.GKEY,
  },
});

// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'mfbsmail.fortesting@gmail.com',
//     pass: process.env.GKEY,
//   },
// });

transporter.verify().then(() => {
  console.log('Ready for send emails');
});
