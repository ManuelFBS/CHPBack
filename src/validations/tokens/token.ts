import { UserEntity } from '../../interfaces/userEntity';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET: any = process.env.SECRET_KEY_TOKEN;

export const token = (savedUser: UserEntity) => {
  const payload = {
    _id: savedUser.id,
    rol: savedUser.rol,
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      SECRET,
      { expiresIn: '2d' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      },
    );
  });
};
