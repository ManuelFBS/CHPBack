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
exports.createNewComment = void 0;
const User_1 = require("../../entities/User");
const Article_1 = require("../../entities/Article");
const Comment_1 = require("../../entities/Comment");
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
        //     const newComment = Comment.create({
        //       comment,
        //       user,
        //       article: [article],
        //     });
        const newComment = new Comment_1.Comment();
        newComment.comment = comment;
        newComment.user = user;
        newComment.article = article;
        const savedComment = yield newComment.save();
        //     const newComment = {
        //       comment: comment,
        //       userId: uID,
        //       articleId: artID,
        //     };
        //     const userComment = await Comment.save(newComment);
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
//# sourceMappingURL=comments.controller.js.map