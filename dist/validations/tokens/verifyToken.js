"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidation = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECRET = process.env.SECRET_KEY_TOKEN;
// export interface IPayload {
//   _id: string;
//   iat: number;
//   exp: number;
//   rol: string;
// }
const TokenValidation = (req, res, next) => {
    const { 'auth-token': authToken } = req.cookies;
    if (!authToken)
        return res.status(401).json({
            message: 'No token, authorization denied...!',
        });
    jsonwebtoken_1.default.verify(authToken, SECRET, (err, user) => {
        if (err)
            return res
                .status(403)
                .json({ message: 'Invalid token' });
        req.allUserData = user;
        next();
    });
};
exports.TokenValidation = TokenValidation;
//# sourceMappingURL=verifyToken.js.map