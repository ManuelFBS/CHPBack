"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users/users.controller");
const articles_controller_1 = require("../controllers/articles/articles.controller");
const verifyToken_1 = require("../validations/tokens/verifyToken");
const router = (0, express_1.Router)();
router.get('/', verifyToken_1.TokenValidation, users_controller_1.getAllUsers);
router.get('/user', verifyToken_1.TokenValidation, users_controller_1.getUserByEmailOrUsername);
router.patch('/user/update', verifyToken_1.TokenValidation, users_controller_1.updateUser);
router.delete('/user/delete', verifyToken_1.TokenValidation, users_controller_1.deleteUser);
// -----------------------------------------------------------------------------------------------------------
router.get('/articles', verifyToken_1.TokenValidation, articles_controller_1.getAllArticles);
router.get('/article/:title', verifyToken_1.TokenValidation, articles_controller_1.getArticleByPartialTitle);
router.get('/article/category/:category', verifyToken_1.TokenValidation, articles_controller_1.getArticlesByCategory);
exports.default = router;
//# sourceMappingURL=users.routes.js.map