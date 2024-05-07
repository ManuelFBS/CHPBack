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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createNewComment = void 0;
const User_1 = require("../../entities/User");
const Article_1 = require("../../entities/Article");
const Comment_1 = require("../../entities/Comment");
const vartype_1 = require("../../libs/vartype");
const createNewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artID, comment, } = req.body;
    try {
        const uID = req.allUserData._id;
        const user = yield User_1.User.findOne({
            where: { id: uID },
        });
        if (!user)
            return res
                .status(404)
                .json({ message: 'User not found...!' });
        const article = yield Article_1.Article.findOne({
            where: { id: artID },
        });
        if (!article)
            return res
                .status(404)
                .json({ message: 'Article not found...!' });
        console.log('ID del artículo', article.id);
        const newComment = new Comment_1.Comment();
        newComment.comment = comment;
        newComment.user = user;
        newComment.article = article;
        const savedComment = yield newComment.save();
        return res.status(200).json({
            message: 'The comment was added successfully...!',
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
exports.createNewComment = createNewComment;
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userName, articleID, commentID, } = req.body;
        let query = {};
        if ((0, vartype_1.isEmailType)(email)) {
            query = { where: { email: email } };
        }
        else {
            query = { where: { userName: userName } };
        }
        const user = yield User_1.User.findOne(query);
        if (!user)
            return res
                .status(404)
                .json({ message: 'User not found...!' });
        if (req.userRole !== 'owner')
            return res.status(401).json({
                message: 'You are not authorized to perform this operation...!',
            });
        const article = yield Article_1.Article.findOne({
            where: { id: articleID },
        });
        if (!article)
            return res
                .status(404)
                .json({ message: 'Article not found...!' });
    }
    catch (error) { }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=comments.controller.js.map