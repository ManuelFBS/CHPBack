import { User } from '../entities/User';
import { Roles } from '../entities/user.roles';

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
