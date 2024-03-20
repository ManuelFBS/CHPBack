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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckOutUserOwner = void 0;
const User_1 = require("../entities/User");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sectok_1 = require("../validations/tokens/sectok");
dotenv_1.default.config();
const CheckOutUserOwner = (tokenHeader, userRol) => __awaiter(void 0, void 0, void 0, function* () {
    const token = tokenHeader;
    // Si no existe, no permite el acceso...
    if (!token) {
        return null;
    }
    // El usuario debe tener rol 'owner' para poder realizar
    // la operación a continuación...
    if (userRol !== 'owner') {
        return null;
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_TOKEN || sectok_1.SECTOK);
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
    if (payload === null ||
        typeof payload !== 'object' ||
        !('_id' in payload) ||
        !('rol' in payload)) {
        return null;
    }
    const verifiedPayload = payload;
    const user = yield User_1.User.findOne({
        where: { id: parseInt(verifiedPayload._id) },
    });
    if (!user) {
        return null;
    }
    return user;
});
exports.CheckOutUserOwner = CheckOutUserOwner;
//# sourceMappingURL=checkOut.js.map