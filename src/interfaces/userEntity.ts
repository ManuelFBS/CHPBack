import { Roles, User } from 'entities/User';

export interface UserEntity extends User {
  name: string;
  lastName: string;
  age: number;
  email: string;
  phoneNumber: string;
  userName: string;
  password: string;
  rol: Roles;
  active: boolean;
}
