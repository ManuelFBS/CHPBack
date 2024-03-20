"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmailType = void 0;
const isEmailType = (value) => {
    if (typeof value === 'string') {
        // Se verifica si el string es un email...
        const regularExpresion = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regularExpresion.test(value);
    }
    else {
        return false;
    }
};
exports.isEmailType = isEmailType;
//# sourceMappingURL=vartype.js.map