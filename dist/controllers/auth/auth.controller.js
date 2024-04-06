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
exports.signOut = exports.signIn = exports.signUp = void 0;
const User_1 = require("../../entities/User");
const encrypted_1 = require("../../validations/password/encrypted");
const decrypted_1 = require("../../validations/password/decrypted");
const token_1 = require("../../validations/tokens/token");
const vartype_1 = require("../../libs/vartype");
const invalidatedTokens = [];
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, lastName, age, email, phoneNumber, userName, password, rol, active, } = req.body;
    try {
        const passwordEncrypted = yield (0, encrypted_1.encrypted)(password);
        const user = new User_1.User();
        user.name = name;
        user.lastName = lastName;
        user.age = age;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.userName = userName;
        user.password = passwordEncrypted;
        user.rol = rol || User_1.Roles.User;
        user.active = active || true;
        const newUser = yield user.save();
        // Remove password from newUser object
        const { password: removedPassword } = newUser, userNoPassword = __rest(newUser, ["password"]);
        // New registered user and token assignment displayed...
        return res
            .header('auth-token', (0, token_1.token)(newUser))
            .json(userNoPassword);
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
        const responseObject = {
            message: 'Successful login',
            id: user.id,
            name: user.name,
            lastname: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            rol: user.rol,
        };
        return res
            .header('auth-token', (0, token_1.token)(user))
            .json(responseObject);
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
const signOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener el token de la solicitud...
        const token = req.header('auth-tokn');
        if (!token)
            return res.status(401).json('Access denied...!');
        // Invalidar el token, añadiéndolo a la lista negra...
        invalidatedTokens.push(token);
        return res.json({ message: 'Logout successful !' });
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
exports.signOut = signOut;
//# sourceMappingURL=auth.controller.js.map