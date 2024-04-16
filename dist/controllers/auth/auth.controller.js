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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.frontVerifyToken = exports.profile = exports.signOut = exports.signIn = exports.signUp = void 0;
const User_1 = require("../../entities/User");
const user_roles_1 = require("../../entities/user.roles");
const encrypted_1 = require("../../validations/password/encrypted");
const decrypted_1 = require("../../validations/password/decrypted");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../../validations/tokens/token");
const vartype_1 = require("../../libs/vartype");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, age, email, phoneNumber, userName, password, rol, active, } = req.body;
    try {
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
        // New registered user and token assignment displayed...
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
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { inputValue, password, } = req.body;
    try {
        let user;
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
            return res.status(404).json('User not found...!');
        if (!(yield (0, decrypted_1.decryptPassword)(password, user.password))) {
            return res
                .status(401)
                .json({ message: 'Invalid password...!' });
        }
        const userToken = yield (0, token_1.token)(user);
        res.cookie('auth-token', userToken);
        return res.status(200).json({
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            userName: user.userName,
            createdAt: user.createdAt.toISOString().split('T')[0],
            updatedAt: user.updatedAt.toISOString().split('T')[0],
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
exports.signIn = signIn;
const signOut = (req, res) => {
    res.cookie('auth-token', '', {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};
exports.signOut = signOut;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.allUserData._id;
    const userFound = yield User_1.User.findOne({ where: { id } });
    if (!userFound)
        return res
            .status(400)
            .json({ message: 'User not found...!' });
    return res.json({
        id: userFound.id,
        name: userFound.name,
        lastName: userFound.lastName,
        age: userFound.age,
        email: userFound.email,
        phoneNumber: userFound.phoneNumber,
        username: userFound.userName,
        createdAt: userFound.createdAt
            .toISOString()
            .split('T')[0],
        updatedAt: userFound.updatedAt
            .toISOString()
            .split('T')[0],
    });
});
exports.profile = profile;
const frontVerifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authToken = req.cookies['auth-token'];
    const role = false;
    if (!authToken)
        return res
            .status(401)
            .json({ message: 'Unauthorized' });
    jsonwebtoken_1.default.verify(authToken, process.env.SECRET_KEY_TOKEN || 'ExtToks#JH450&0021RTD', (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res
                .status(401)
                .json({ message: 'Unauthorized' });
    }));
    const userFound = yield User_1.User.findOne({
        where: { id: parseInt(req.userId) },
    });
    if (!userFound)
        return res
            .status(401)
            .json({ message: 'Unauthorized' });
    return res.json([
        authToken,
        {
            id: userFound.id,
            name: userFound.name,
            lastName: userFound.lastName,
            email: userFound.email,
            rol: userFound.rol,
        },
    ]);
});
exports.frontVerifyToken = frontVerifyToken;
//# sourceMappingURL=auth.controller.js.map