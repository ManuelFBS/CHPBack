"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserByEmailOrUsername = exports.getAllUsers = exports.createUser = void 0;
const User_1 = require("../../entities/User");
const user_roles_1 = require("../../entities/user.roles");
const token_1 = require("../../validations/tokens/token");
const vartype_1 = require("../../libs/vartype");
const encrypted_1 = require("../../validations/password/encrypted");
const decrypted_1 = require("../../validations/password/decrypted");
const database_1 = require("../../db/database");
const checkOutAccess_1 = require("../../libs/checkOutAccess");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, age, email, phoneNumber, userName, password, rol, active, } = req.body;
    try {
        if (!(0, checkOutAccess_1.AuthorizationSup)(req, res))
            return res.status(401).json({
                message: 'You are not authorized to carry out this operation...!',
            });
        const emailExists = yield User_1.User.findOne({
            where: { email: email },
        });
        const phoneNumberExists = yield User_1.User.findOne({
            where: { phoneNumber: phoneNumber },
        });
        if (emailExists)
            return res
                .status(400)
                .json(['The email already exists...!']);
        if (phoneNumberExists)
            return res
                .status(400)
                .json(['This Phone number already exists...!']);
        const passwordEncrypted = yield (0, encrypted_1.encrypted)(password);
        const ageString = req.body.age;
        const ageInt = parseInt(ageString, 10);
        const user = new User_1.User();
        user.name = name;
        user.lastName = lastName;
        user.age = ageInt;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.userName = userName;
        user.password = passwordEncrypted;
        user.rol = rol || user_roles_1.Roles.User;
        user.active = active || true;
        const newUser = yield user.save();
        // Remove password from newUser object
        const { password: removedPassword } = newUser, userNoPassword = __rest(newUser, ["password"]);
        const userToken = yield (0, token_1.token)(newUser);
        res.cookie('auth-token', userToken);
        return res.status(201).json(userNoPassword);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.createUser = createUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderBy } = req.query;
        let orderOptions = {};
        if (orderBy === 'id' || orderBy === 'lastName') {
            orderOptions[orderBy] = 'ASC';
        }
        else {
            orderOptions['id'] = 'ASC';
        }
        // Se verifica el rol del usuario para permitir o no el acceso
        if (!(0, checkOutAccess_1.AuthorizationOA)(req, res))
            return res.status(403).json('Access denied...!');
        const users = yield User_1.User.find({
            select: [
                'id',
                'name',
                'lastName',
                'age',
                'email',
                'phoneNumber',
                'userName',
                'rol',
                'active',
                'createdAt',
                'updatedAt',
            ],
            order: orderOptions,
        });
        return res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.getAllUsers = getAllUsers;
const getUserByEmailOrUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { inputValue } = req.body;
    let user;
    try {
        if ((0, vartype_1.isEmailType)(inputValue)) {
            user = yield User_1.User.findOne({
                where: { email: inputValue },
            });
        }
        else {
            user = yield User_1.User.findOne({
                where: { userName: inputValue },
            });
        }
        if (!user)
            return res
                .status(404)
                .json({ message: 'User not found...' });
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        const formattedUser = Object.assign(Object.assign({}, userWithoutPassword), { createdAt: user.createdAt.toISOString().split('T')[0], updatedAt: user.updatedAt.toISOString().split('T')[0] });
        return res.status(200).json(formattedUser);
    }
    catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.getUserByEmailOrUsername = getUserByEmailOrUsername;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, lastName, age, email, phoneNumber, userName, password, rol, active, newPassword, } = req.body;
        if (!(email || userName) || !password) {
            return res.status(401).json({
                message: 'You must provide email (or Username) and password...',
            });
        }
        let user;
        let inputQuery;
        let inputValue;
        if (email) {
            if ((0, vartype_1.isEmailType)(email)) {
                user = yield User_1.User.findOne({ where: { email } });
                inputQuery = 'email = :email';
                inputValue = { email: email };
            }
            else {
                return res
                    .status(401)
                    .json({ message: 'Email not valid...' });
            }
        }
        else if (userName) {
            user = yield User_1.User.findOne({ where: { userName } });
            inputQuery = 'userName = :userName';
            inputValue = { userName: userName };
        }
        if (!user) {
            return res
                .status(404)
                .json({ message: 'User not found.' });
        }
        const isPasswordValid = yield (0, decrypted_1.decryptPassword)(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: 'Invalid password...' });
        }
        let encryptedPassword;
        if (newPassword) {
            encryptedPassword = yield (0, encrypted_1.encrypted)(newPassword);
            newPassword = encryptedPassword;
        }
        const dataSource = database_1.AppDataSource;
        const newDataUser = {
            name: name,
            lastName: lastName,
            age: age,
            email: email,
            phoneNumber: phoneNumber,
            userName: userName,
            password: newPassword,
            rol: rol,
            active: active,
        };
        dataSource
            .createQueryBuilder()
            .update(User_1.User)
            .set(newDataUser)
            .where(inputQuery, inputValue)
            .execute();
        return res.status(200).json({
            message: 'User data updated successfully...!',
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { email, userName } = req.body;
    try {
        if (!(0, checkOutAccess_1.AuthorizationSO)(req, res))
            return res.status(401).json({
                message: 'You are not authorized to carry out this operation...!',
            });
        let user;
        let query;
        if (id) {
            user = yield User_1.User.findOneBy({ id: parseInt(id) });
            query = { id: parseInt(id) };
        }
        else if (email) {
            if ((0, vartype_1.isEmailType)(email)) {
                user = yield User_1.User.findOneBy({ email: email });
                query = { email: email };
            }
        }
        else if (userName) {
            user = yield User_1.User.findOneBy({ userName: userName });
            query = { userName: userName };
        }
        else {
            return res.status(400).json({
                message: 'You must provide Id, Email or Username...',
            });
        }
        if (!user)
            return res
                .status(404)
                .json({ message: 'User not found' });
        yield User_1.User.delete(query);
        return res.status(200).json({
            message: 'The user was successfully deleted...!',
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=users.controller.js.map