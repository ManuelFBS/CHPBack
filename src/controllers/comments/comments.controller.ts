import { Request, Response } from 'express';
import { User } from '../../entities/User';
import { Article } from '../../entities/Article';
import { Comment } from '../../entities/Comment';
import { isEmailType } from '../../libs/vartype';

export const createNewComment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const {
    artID,
    comment,
  }: { artID: number; comment: string } = req.body;

  try {
    const uID: number = req.allUserData._id;
    const user: any = await User.findOne({
      where: { id: uID },
    });

    if (!user)
      return res
        .status(404)
        .json({ message: 'User not found...!' });

    const article = await Article.findOne({
      where: { id: artID },
    });

    if (!article)
      return res
        .status(404)
        .json({ message: 'Article not found...!' });

    console.log('ID del artículo', article.id);

    const newComment = new Comment();
    newComment.comment = comment;
    newComment.user = user;
    newComment.article = article;

    const savedComment = await newComment.save();

    return res.status(200).json({
      message: 'The comment was added successfully...!',
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      email,
      userName,
      articleID,
      commentID,
    }: {
      email: string;
      userName: string;
      articleID: number;
      commentID: number;
    } = req.body;

    let query: object = {};

    if (isEmailType(email)) {
      query = { where: { email: email } };
    } else {
      query = { where: { userName: userName } };
    }

    const user = await User.findOne(query);

    if (!user)
      return res
        .status(404)
        .json({ message: 'User not found...!' });

    if (req.userRole !== 'owner')
      return res.status(401).json({
        message:
          'You are not authorized to perform this operation...!',
      });

    const article = await Article.findOne({
      where: { id: articleID },
    });

    if (!article)
      return res
        .status(404)
        .json({ message: 'Article not found...!' });
  } catch (error) {}
};
