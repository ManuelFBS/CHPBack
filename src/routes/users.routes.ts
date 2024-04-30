import { Request, Response, Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserByEmailOrUsername,
  updateUser,
} from '../controllers/users/users.controller';
import {
  getAllArticles,
  getArticleByPartialTitle,
  getArticleByID,
  getArticlesByCategory,
} from '../controllers/articles/articles.controller';
import { createNewComment } from '../controllers/comments/comments.controller';
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

router.get(
  '/article/category/:category',
  TokenValidation,
  getArticlesByCategory,
);

router.get(
  '/article/find/:id',
  TokenValidation,
  getArticleByID,
);

// -----------------------------------------------------------------------------------------------------------

router.post(
  '/user/article/comment/new',
  TokenValidation,
  createNewComment,
);

export default router;
