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
      .status(401)
      .json({ message: 'You must provide a title...' });
  }

  try {
    const articleFound: ArticleEntity[] =
      await Article.find({
        where: {
          title: Raw(
            (alias) =>
              `LOWER(${alias}) LIKE LOWER('%${partialTitle}%')`,
          ),
        },
      });

    if (!articleFound)
      return res
        .status(404)
        .json({ message: 'Article not found...' });

    const { createdAt, updatedAt, ...articleTemp } =
      articleFound[0];

    const formattedArticle = {
      ...articleTemp,
      createdAt: articleFound[0].createdAt
        .toISOString()
        .split('T')[0],
      udatedAt: articleFound[0].updatedAt
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

    const { title, article } = req.body;

    const dataSource = AppDataSource;
    const data: Article[] | any = {
      title: title,
      article: article,
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
