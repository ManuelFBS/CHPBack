import { z } from 'zod';
import { Roles } from '../entities/user.roles';

const rolesArray = Object.values(Roles).map((role) =>
  role.toString(),
);

export const SignUpSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required...',
        invalid_type_error: 'The Name must be a string...',
      })
      .min(3, {
        message:
          'The Name must be at least 3 characters...',
      })
      .max(100, {
        message:
          'The Name must have a maximum of 100 characters...',
      }),
    lastName: z
      .string({
        required_error: 'Last Names is required...',
        invalid_type_error:
          'The Last Names must be a string...',
      })
      .min(3, {
        message:
          'The Last Names must be at least 3 characters',
      })
      .max(100, {
        message:
          'The Last Names must have a maximum of 100 characters',
      }),
    age: z
      .number()
      .int({ message: 'The Age must be an integer...' })
      .positive({
        message: 'The Age must be positive number...',
      })
      .refine((value) => value > 12, {
        message: 'The Age must be greater than twelve',
      })
      .optional(),
    email: z
      .string({
        required_error: 'Email is required...',
        invalid_type_error: 'The email must be a string...',
      })
      .email({ message: 'Must provide a valid email...' })
      .max(50, {
        message:
          'The email must be a maximum of 50 characters',
      }),
    phoneNumber: z
      .string()
      .max(20, {
        message:
          'The Phone number must have a maximum of 20 characters...',
      })
      .optional(),
    userName: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string...',
      })
      .min(5, {
        message:
          'The Username must be at least 5 characters...',
      })
      .max(15, {
        message:
          'The Username must have a maximum of 15 characters...',
      }),
    password: z
      .string({
        required_error: 'Password is required...',
        invalid_type_error:
          'The password must be a string...',
      })
      .min(6, {
        message:
          'Password must be a minimum of 6 characters',
      })
      .max(20, {
        message:
          'Password must be a maximum of 20 characters',
      }),
    rol: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

export const SignInSchema = z.object({
  body: z.object({
    inputValue: z
      .string({
        required_error: 'User name or email is required...',
        invalid_type_error:
          'User name: must be a string / Email: must be a valid format...',
      })
      .min(5, {
        message:
          'User name: min 5 chars / Email: a valid format...',
      }),
    password: z
      .string({
        required_error: 'Password is required...',
        invalid_type_error:
          'The password must be a string...',
      })
      .min(6, {
        message:
          'Password must be a minimum of 6 characters',
      })
      .max(20, {
        message:
          'Password must be a maximum of 20 characters',
      }),
  }),
});
