import { Comment } from '../entities/Comment';

export interface CommentEntity extends Comment {
  comment: string;
}
