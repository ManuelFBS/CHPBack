import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './Comment';

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: false,
  })
  title: string;

  @Column({ type: 'text', nullable: false })
  article: string;

  @Column({
    default: 'Category...?',
    nullable: false,
  })
  category: string;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
