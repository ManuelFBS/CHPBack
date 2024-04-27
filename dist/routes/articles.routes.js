"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../validations/tokens/verifyToken");
const articles_controller_1 = require("../controllers/articles/articles.controller");
const router = (0, express_1.Router)();
router.post('/create', verifyToken_1.TokenValidation, articles_controller_1.createArticle);
// -------------------------------------------------------------------------------------------------- //
// Estas 2 rutas, están disponibles para todos los usuarios...
// http://localhost:7000/api/users/articles
router.get('/articles', verifyToken_1.TokenValidation, articles_controller_1.getAllArticles);
// http://localhost:7000/api/users/article/:title
router.get('/article/:title', verifyToken_1.TokenValidation, articles_controller_1.getArticleByPartialTitle);
// http://localhost:7000/api/users/article/category/:category
router.get('/article/category/:category', verifyToken_1.TokenValidation, articles_controller_1.getArticlesByCategory);
// -------------------------------------------------------------------------------------------------- //
router.get('/article/find/:id', verifyToken_1.TokenValidation, articles_controller_1.getArticleByID);
router.patch('/article/edit/:id', verifyToken_1.TokenValidation, articles_controller_1.updateArticle);
router.delete('/article/delete/:id', verifyToken_1.TokenValidation, articles_controller_1.deleteArticle);
// router.delete('/article/delete', TokenValidation, deleteArticle);
exports.default = router;
//# sourceMappingURL=articles.routes.js.map