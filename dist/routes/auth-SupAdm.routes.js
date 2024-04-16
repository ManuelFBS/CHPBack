"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users/users.controller");
const verifyToken_1 = require("../validations/tokens/verifyToken");
const router = (0, express_1.Router)();
router.post('/create', verifyToken_1.TokenValidation, users_controller_1.createUser);
exports.default = router;
//# sourceMappingURL=auth-SupAdm.routes.js.map