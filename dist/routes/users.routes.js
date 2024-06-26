"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users/users.controller");
const appointments_controller_1 = require("../controllers/appointments/appointments.controller");
const articles_controller_1 = require("../controllers/articles/articles.controller");
const comments_controller_1 = require("../controllers/comments/comments.controller");
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
router.get('/article/find/:id', verifyToken_1.TokenValidation, articles_controller_1.getArticleByID);
// -----------------------------------------------------------------------------------------------------------
router.post('/user/article/comment/new', verifyToken_1.TokenValidation, comments_controller_1.createNewComment);
// -----------------------------------------------------------------------------------------------------------
router.post('/user/appointment/booker', verifyToken_1.TokenValidation, appointments_controller_1.makeAppointment);
router.patch('/user/appointment/cancelled', verifyToken_1.TokenValidation, appointments_controller_1.cancelledAppointment);
exports.default = router;
//# sourceMappingURL=users.routes.js.map