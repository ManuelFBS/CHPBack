import { UserEntity } from '../../interfaces/userEntity';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SECTOK } from './sectok';

dotenv.config();

export const token = (savedUser: UserEntity): string => {
  const payload = {
    _id: savedUser.id,
    rol: savedUser.rol,
  };

  const token = jwt.sign(
    payload,
    process.env.SECRET_KEY_TOKEN || SECTOK,
    { expiresIn: '2d' },
  );

  return token;
};
