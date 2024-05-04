import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'manuelf.borrego@gmail.com',
  password: process.env.GKEY,
};
