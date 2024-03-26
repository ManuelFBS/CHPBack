"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteArticle = exports.updateArticle = exports.getArticleByPartialTitle = exports.getAllArticles = exports.createArticle = void 0;
const Article_1 = require("../../entities/Article");
const checkOut_1 = require("../../libs/checkOut");
const typeorm_1 = require("typeorm");
const database_1 = require("../../db/database");
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('auth-token');
        const userRol = req.userRole;
        const authUser = yield (0, checkOut_1.CheckOutUserOwner)(token, userRol);
        if (!authUser) {
            return res.status(401).json({
                message: 'Unauthorized or non-existent user...!',
            });
        }
        const { title, article, } = req.body;
        const newArticle = new Article_1.Article();
        newArticle.title = title;
        newArticle.article = article;
        yield newArticle.save();
        return res
            .status(201)
            .json({ message: 'A new Article has saved...!' });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.createArticle = createArticle;
const getAllArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield Article_1.Article.find({
            select: ['id', 'title', 'article'],
        });
        return res.status(200).json(articles);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.getAllArticles = getAllArticles;
const getArticleByPartialTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const partialTitle = req.params.title;
    if (!partialTitle) {
        return res
            .status(401)
            .json({ message: 'You must provide a title...' });
    }
    try {
        const articleFound = yield Article_1.Article.find({
            where: {
                title: (0, typeorm_1.Raw)((alias) => `LOWER(${alias}) LIKE LOWER('%${partialTitle}%')`),
            },
        });
        if (!articleFound)
            return res
                .status(404)
                .json({ message: 'Article not found...' });
        const _a = articleFound[0], { createdAt, updatedAt } = _a, articleTemp = __rest(_a, ["createdAt", "updatedAt"]);
        const formattedArticle = Object.assign(Object.assign({}, articleTemp), { createdAt: articleFound[0].createdAt
                .toISOString()
                .split('T')[0], udatedAt: articleFound[0].updatedAt
                .toISOString()
                .split('T')[0] });
        return res.status(200).json(formattedArticle);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.getArticleByPartialTitle = getArticleByPartialTitle;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Se autentica al usuario tipo 'owner', quien es el único
        // autozizado para realizar esta operación...
        const token = req.header('auth-token');
        const userRol = req.userRole;
        const authUser = yield (0, checkOut_1.CheckOutUserOwner)(token, userRol);
        if (!authUser) {
            return res.status(401).json({
                message: 'Unauthorized or non-existent user...!',
            });
        }
        // -------------------------------------------------------------------------------------------------
        const id = parseInt(req.params.id);
        // Se verifica si existe el artículo o no a editar...
        const articleExists = yield Article_1.Article.findOne({
            where: { id },
        });
        if (!articleExists) {
            return res
                .status(404)
                .json({ message: 'Article not found...' });
        }
        // -------------------------------------------------------------------------------------------------
        const { title, article } = req.body;
        const dataSource = database_1.AppDataSource;
        const data = {
            title: title,
            article: article,
        };
        dataSource
            .createQueryBuilder()
            .update(Article_1.Article)
            .set(data)
            .where('id = :id', { id: id })
            .execute();
        return res
            .status(200)
            .json({ messaege: 'Article has been updated...' });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('auth-token');
        const userRol = req.userRole;
        const authUser = yield (0, checkOut_1.CheckOutUserOwner)(token, userRol);
        if (!authUser) {
            return res.status(401).json({
                message: 'Unauthorized or non-existent user...!',
            });
        }
        // -------------------------------------------------------------------------------------------------
        const id = parseInt(req.params.id);
        // Se verifica si existe el artículo o no a editar...
        const articleExists = yield Article_1.Article.findOne({
            where: { id },
        });
        if (!articleExists) {
            return res
                .status(404)
                .json({ message: 'Article not found...' });
        }
        // -------------------------------------------------------------------------------------------------
        const dataSource = database_1.AppDataSource;
        yield dataSource
            .createQueryBuilder()
            .delete()
            .from(Article_1.Article)
            .where('id = :id', { id: id })
            .execute();
        //
        return res.status(200).json({
            message: 'The article has been successfully deleted...!',
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.deleteArticle = deleteArticle;
//# sourceMappingURL=articles.controller.js.map