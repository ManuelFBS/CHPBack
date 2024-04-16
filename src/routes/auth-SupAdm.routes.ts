import { Router } from 'express';
import { createUser } from '../controllers/users/users.controller';
import { TokenValidation } from '../validations/tokens/verifyToken';

const router: Router = Router();

router.post('/create', TokenValidation, createUser);

export default router;
