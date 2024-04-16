import { Article } from '../entities/Article';

export interface ArticleEntity extends Article {
  id: number;
  title: string;
  article: string;
  category: string;
}
