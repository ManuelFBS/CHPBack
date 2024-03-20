import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { SECTOK } from './sectok';

dotenv.config();

export interface IPayload {
  _id: string;
  iat: number;
  exp: number;
  rol: string;
}

export const TokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('auth-token');

  if (!token)
    return res.status(401).json('Access denied...!');

  try {
    const payload = jwt.verify(
      token,
      process.env.SECRET_KEY_TOKEN || SECTOK,
    ) as IPayload;

    // Check if the token has expired...
    if (Date.now() >= payload.exp * 1000) {
      return res
        .status(401)
        .json(
          'Your session has expired. You must log in again...',
        );
    }

    // req.userId = payload._id;
    req.userRole = payload.rol;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(401)
        .json(
          'Your session has expired. You must log in again...',
        );
    } else {
      return res.status(401).json('Invalid token...!');
    }
  }
};
