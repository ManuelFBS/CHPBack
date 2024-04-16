import { Router } from 'express';
import {
  signIn,
  signOut,
  signUp,
  frontVerifyToken,
  profile,
} from '../controllers/auth/auth.controller';
import { SchemaValidation } from '../middlewares/schemaValidator.middleware';
import { SignUpSchema } from '../schemas/auth.schema';
import { TokenValidation } from '../validations/tokens/verifyToken';

const router: Router = Router();

router.post(
  '/signup',
  SchemaValidation(SignUpSchema),
  signUp,
);

router.post('/signin', signIn);

router.post('/signout', signOut);

router.get('/profile', TokenValidation, profile);

router.get('/verify', frontVerifyToken);

export default router;
