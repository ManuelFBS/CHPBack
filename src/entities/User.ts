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
import { Roles } from './user.roles';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    primaryKeyConstraintName: 'pk_user_id',
  })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  lastName: string;

  @Column()
  age: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
    nullable: false,
  })
  userName: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.User,
  })
  rol: Roles;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Método para verificar si el usuario tiene el rol de 'owner'...
  isOwner(): boolean {
    return this.rol === Roles.Owner;
  }
}
