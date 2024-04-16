"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = process.env.SECRET_KEY_TOKEN;
const token = (savedUser) => {
    const payload = {
        _id: savedUser.id,
        rol: savedUser.rol,
    };
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '2d' }, (err, token) => {
            if (err)
                reject(err);
            resolve(token);
        });
    });
    // return new Promise((resolve, reject) => {
    //   jwt.sign(
    //     payload,
    //     process.env.SECRET_KEY_TOKEN || 'ExtToks112244',
    //     { expiresIn: '2d' },
    //     (err, token) => {
    //       if (err) reject(err);
    //       resolve(token);
    //     },
    //   );
    // });
};
exports.token = token;
//# sourceMappingURL=token.js.map