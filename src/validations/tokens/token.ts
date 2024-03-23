import { UserEntity } from '../../interfaces/userEntity';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const token = (savedUser: UserEntity): string => {
  const payload = {
    _id: savedUser.id,
    rol: savedUser.rol,
  };

  const token = jwt.sign(
    payload,
    process.env.SECRET_KEY_TOKEN || 'ExtToks112244',
    { expiresIn: '2d' },
  );

  return token;
};
