import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const AuthorizationOw = (
  req: Request,
  res: Response,
): Boolean => {
  if (req.allUserData.rol !== process.env.AUTH_REQUIRED_O)
    return false;

  return true;
};

export const AuthorizationOA = (
  req: Request,
  res: Response,
): Boolean => {
  if (
    req.allUserData.rol !== process.env.AUTH_REQUIRED_O &&
    req.allUserData.rol !== process.env.AUTH_REQUIRED_A
  )
    return false;

  return true;
};

export const AuthorizationSO = (
  req: Request,
  res: Response,
): Boolean => {
  console.log(req.allUserData.rol);

  if (
    req.allUserData.rol !== process.env.AUTH_REQUIRED_SA &&
    req.allUserData.rol !== process.env.AUTH_REQUIRED_O
  )
    return false;

  return true;
};

export const AuthorizationSup = (
  req: Request,
  res: Response,
): Boolean => {
  if (req.allUserData.rol !== process.env.AUTH_REQUIRED_SA)
    return false;

  return true;
};
