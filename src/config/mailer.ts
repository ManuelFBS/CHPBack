import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'manuelf.borrego@gmail.com',
    pass: 'sdvh yyab tvvj tfob',
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
