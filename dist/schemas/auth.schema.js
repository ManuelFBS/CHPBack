"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
const user_roles_1 = require("../entities/user.roles");
const rolesArray = Object.values(user_roles_1.Roles).map((role) => role.toString());
exports.SignUpSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required...',
            invalid_type_error: 'The Name must be a string...',
        })
            .min(3, {
            message: 'The Name must be at least 3 characters...',
        })
            .max(100, {
            message: 'The Name must have a maximum of 100 characters...',
        }),
        lastName: zod_1.z
            .string({
            required_error: 'Last Names is required...',
            invalid_type_error: 'The Last Names must be a string...',
        })
            .min(3, {
            message: 'The Last Names must be at least 3 characters',
        })
            .max(100, {
            message: 'The Last Names must have a maximum of 100 characters',
        }),
        age: zod_1.z
            .number()
            .int({ message: 'The Age must be an integer...' })
            .positive({
            message: 'The Age must be positive number...',
        })
            .refine((value) => value > 12, {
            message: 'The Age must be greater than twelve',
        })
            .optional(),
        email: zod_1.z
            .string({
            required_error: 'Email is required...',
            invalid_type_error: 'The email must be a string...',
        })
            .email({ message: 'Must provide a valid email...' })
            .max(50, {
            message: 'The email must be a maximum of 50 characters',
        }),
        phoneNumber: zod_1.z
            .string()
            .max(20, {
            message: 'The Phone number must have a maximum of 20 characters...',
        })
            .optional(),
        userName: zod_1.z
            .string({
            required_error: 'Username is required',
            invalid_type_error: 'Username must be a string...',
        })
            .min(5, {
            message: 'The Username must be at least 5 characters...',
        })
            .max(15, {
            message: 'The Username must have a maximum of 15 characters...',
        }),
        password: zod_1.z
            .string({
            required_error: 'Password is required...',
            invalid_type_error: 'The email must be a string...',
        })
            .min(6, {
            message: 'Password must be a minimum of 6 characters',
        })
            .max(20, {
            message: 'Password must be a maximum of 20 characters',
        }),
        rol: zod_1.z.string().optional(),
        active: zod_1.z.boolean().optional(),
    }),
});
exports.SignInSchema = zod_1.z.object({});
//# sourceMappingURL=auth.schema.js.map