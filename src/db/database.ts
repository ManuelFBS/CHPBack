import { DataSource } from 'typeorm';
import { Article } from '../entities/Article';
import { Comment } from '../entities/Comment';
import { Appointment } from '../entities/Appointment';
import { User } from '../entities/User';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT as any),
  database: process.env.DB_NAME,
  entities: [Article, Comment, Appointment, User],
  logging: false,
  synchronize: true,
});
