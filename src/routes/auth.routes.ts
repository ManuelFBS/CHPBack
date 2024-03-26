import { Router } from 'express';
import {
  signIn,
  signOut,
  signUp,
} from '../controllers/auth/auth.controller';
import { SchemaValidation } from '../middlewares/schemaValidator.middleware';
import { SignUpSchema } from '../schemas/auth.schema';

const router: Router = Router();

router.post(
  '/signup',
  SchemaValidation(SignUpSchema),
  signUp,
);

router.post('/signin', signIn);

router.delete('/signout', signOut);

export default router;
