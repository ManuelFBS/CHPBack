"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationSup = exports.AuthorizationSO = exports.AuthorizationOA = exports.AuthorizationOw = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AuthorizationOw = (req, res) => {
    if (req.allUserData.rol !== process.env.AUTH_REQUIRED_O)
        return false;
    return true;
};
exports.AuthorizationOw = AuthorizationOw;
const AuthorizationOA = (req, res) => {
    if (req.allUserData.rol !== process.env.AUTH_REQUIRED_O &&
        req.allUserData.rol !== process.env.AUTH_REQUIRED_A)
        return false;
    return true;
};
exports.AuthorizationOA = AuthorizationOA;
const AuthorizationSO = (req, res) => {
    console.log(req.allUserData.rol);
    if (req.allUserData.rol !== process.env.AUTH_REQUIRED_SA &&
        req.allUserData.rol !== process.env.AUTH_REQUIRED_O)
        return false;
    return true;
};
exports.AuthorizationSO = AuthorizationSO;
const AuthorizationSup = (req, res) => {
    if (req.allUserData.rol !== process.env.AUTH_REQUIRED_SA)
        return false;
    return true;
};
exports.AuthorizationSup = AuthorizationSup;
//# sourceMappingURL=checkOutAccess.js.map