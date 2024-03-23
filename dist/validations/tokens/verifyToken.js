"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenValidation = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
dotenv_1.default.config();
const TokenValidation = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token)
        return res.status(401).json('Access denied...!');
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_TOKEN || 'ExtToks112244');
        // Check if the token has expired...
        if (Date.now() >= payload.exp * 1000) {
            return res
                .status(401)
                .json('Your session has expired. You must log in again...');
        }
        // req.userId = payload._id;
        req.userRole = payload.rol;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res
                .status(401)
                .json('Your session has expired. You must log in again...');
        }
        else {
            return res.status(401).json('Invalid token...!');
        }
    }
};
exports.TokenValidation = TokenValidation;
//# sourceMappingURL=verifyToken.js.map