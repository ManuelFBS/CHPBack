import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserByEmailOrUsername,
  updateUser,
} from '../controllers/users/users.controller';
import {
  getAllArticles,
  getArticleByPartialTitle,
} from '../controllers/articles/articles.controller';
import { TokenValidation } from '../validations/tokens/verifyToken';

const router: Router = Router();

router.get('/', TokenValidation, getAllUsers);

router.get(
  '/user',
  TokenValidation,
  getUserByEmailOrUsername,
);

router.patch('/user/update', TokenValidation, updateUser);

router.delete('/user/delete', TokenValidation, deleteUser);

// -----------------------------------------------------------------------------------------------------------

router.get('/articles', TokenValidation, getAllArticles);

router.get(
  '/article/:title',
  TokenValidation,
  getArticleByPartialTitle,
);

export default router;
