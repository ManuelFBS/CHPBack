import { Request, Response } from 'express';
import { Article } from '../../entities/Article';
import { Raw } from 'typeorm';
import { ArticleEntity } from '../../interfaces/articleEntity';
import { AppDataSource } from '../../db/database';
import { AuthorizationOw } from '../../libs/checkOutAccess';

export const createArticle = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // const userRol = req.allUserData.rol;

    if (!AuthorizationOw(req, res))
      return res.status(401).json({
        message:
          'You are not authorized to carry out this operation...!',
      });

    const {
      title,
      article,
      category,
    }: {
      title: string;
      article: string;
      category: string;
    } = req.body;

    const newArticle = new Article();
    newArticle.title = title;
    newArticle.article = article;
    newArticle.category = category;

    await newArticle.save();

    return res
      .status(201)
      .json({ message: 'A new Article has saved...!' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const getAllArticles = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const articles = await Article.find({
      select: ['id', 'title', 'article', 'category'],
    });

    return res.status(200).json(articles);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const getArticleByPartialTitle = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const partialTitle = req.params.title;

  if (!partialTitle) {
    return res
      .status(400)
      .json({ message: 'You must provide a title...' });
  }

  try {
    const article = await Article.createQueryBuilder(
      'article',
    )
      .leftJoinAndSelect('article.comments', 'comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where(
        'LOWER(article.title) LIKE LOWER(:partialTitle)',
        { partialTitle: `%${partialTitle}%` },
      )
      .getOne();

    if (!article) {
      return res
        .status(404)
        .json({ message: 'Article not found...' });
    }

    article.comments = article.comments.map(
      (comment: any) => ({
        ...comment,
        createdAt: comment.createdAt
          .toISOString()
          .split('T')[0],
        updatedAt: comment.updatedAt
          .toISOString()
          .split('T')[0],
        user: {
          name: comment.user.name,
          lastName: comment.user.lastName,
          email: comment.user.email,
        },
      }),
    );

    const { createdAt, updatedAt, ...articleTemp } =
      article;

    const formattedArticle = {
      ...articleTemp,
      createdAt: article.createdAt
        .toISOString()
        .split('T')[0],
      udatedAt: article.updatedAt
        .toISOString()
        .split('T')[0],
    };

    return res.status(200).json(formattedArticle);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const getArticleByID = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  if (!id) {
    return res
      .status(400)
      .json({ message: 'You must provide a id...' });
  }

  try {
    const article = await Article.findOne({
      where: { id },
    });

    if (!article)
      return res
        .status(404)
        .json({ message: 'Article not found' });

    return res.status(200).json(article);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const getArticlesByCategory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { category } = req.params;

    const articles = await Article.find({
      where: { category },
    });

    if (!articles || articles.length === 0)
      return res
        .status(404)
        .json({ message: 'Article not found...' });

    const formattedArticles = articles.map((article) => ({
      ...article,
      createdAt: article.createdAt
        .toISOString()
        .split('T')[0],
      updatedAt: article.updatedAt
        .toISOString()
        .split('T')[0],
    }));

    return res.status(200).json(formattedArticles);
  } catch (error) {
    // console.error(error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const updateArticle = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    // Se autentica al usuario tipo 'owner', quien es el único
    // autozizado para realizar esta operación...
    const userRol = req.allUserData.rol;

    if (userRol !== 'owner') {
      return res.status(401).json({
        message:
          'You are not authorized to carry out this operation...!',
      });
    }
    // -------------------------------------------------------------------------------------------------

    const id = parseInt(req.params.id);

    // Se verifica si existe el artículo o no a editar...
    const articleExists = await Article.findOne({
      where: { id },
    });

    if (!articleExists) {
      return res
        .status(404)
        .json({ message: 'Article not found...' });
    }
    // -------------------------------------------------------------------------------------------------

    const { title, article, category } = req.body;

    const dataSource = AppDataSource;
    const data: Article[] | any = {
      title: title,
      article: article,
      category: category,
    };

    dataSource
      .createQueryBuilder()
      .update(Article)
      .set(data)
      .where('id = :id', { id: id })
      .execute();

    return res
      .status(200)
      .json({ messaege: 'Article has been updated...' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const deleteArticle = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const userRol = req.allUserData.rol;

    if (userRol !== 'owner') {
      return res.status(401).json({
        message:
          'You are not authorized to carry out this operation...!',
      });
    }
    // -------------------------------------------------------------------------------------------------

    const id = parseInt(req.params.id);

    // Se verifica si existe el artículo o no a editar...
    const articleExists = await Article.findOne({
      where: { id },
    });

    if (!articleExists) {
      return res
        .status(404)
        .json({ message: 'Article not found...' });
    }
    // -------------------------------------------------------------------------------------------------

    const dataSource = AppDataSource;

    await dataSource
      .createQueryBuilder()
      .delete()
      .from(Article)
      .where('id = :id', { id: id })
      .execute();
    //
    return res.status(200).json({
      message:
        'The article has been successfully deleted...!',
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};
