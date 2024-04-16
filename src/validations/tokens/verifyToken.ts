import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

dotenv.config();

const SECRET: any = process.env.SECRET_KEY_TOKEN;

// export interface IPayload {
//   _id: string;
//   iat: number;
//   exp: number;
//   rol: string;
// }

export const TokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { 'auth-token': authToken } = req.cookies;

  if (!authToken)
    return res.status(401).json({
      message: 'No token, authorization denied...!',
    });

  jwt.verify(authToken, SECRET, (err: any, user: any) => {
    if (err)
      return res
        .status(403)
        .json({ message: 'Invalid token' });

    req.allUserData = user;

    next();
  });
};
