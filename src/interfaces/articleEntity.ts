import { Article } from '../entities/Article';

export interface ArticleEntity extends Article {
  title: string;
  article: string;
}
