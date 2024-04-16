import { Router } from 'express';
import { TokenValidation } from '../validations/tokens/verifyToken';
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleByPartialTitle,
  getArticlesByCategory,
  updateArticle,
} from '../controllers/articles/articles.controller';

const router: Router = Router();

router.post('/create', TokenValidation, createArticle);

// -------------------------------------------------------------------------------------------------- //
// Estas 2 rutas, están disponibles para todos los usuarios...
// http://localhost:7000/api/users/articles
router.get('/articles', TokenValidation, getAllArticles);

// http://localhost:7000/api/users/article/:title
router.get(
  '/article/:title',
  TokenValidation,
  getArticleByPartialTitle,
);

// http://localhost:7000/api/users/article/category/:category
router.get(
  '/article/category/:category',
  TokenValidation,
  getArticlesByCategory,
);
// -------------------------------------------------------------------------------------------------- //

router.patch(
  '/article/edit/:id',
  TokenValidation,
  updateArticle,
);

router.delete(
  '/article/delete/:id',
  TokenValidation,
  deleteArticle,
);

// router.delete('/article/delete', TokenValidation, deleteArticle);

export default router;
