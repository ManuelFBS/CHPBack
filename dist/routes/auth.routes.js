"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth/auth.controller");
const schemaValidator_middleware_1 = require("../middlewares/schemaValidator.middleware");
const auth_schema_1 = require("../schemas/auth.schema");
const router = (0, express_1.Router)();
router.post('/signup', (0, schemaValidator_middleware_1.SchemaValidation)(auth_schema_1.SignUpSchema), auth_controller_1.signUp);
router.post('/signin', auth_controller_1.signIn);
router.delete('/signout', auth_controller_1.signOut);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map