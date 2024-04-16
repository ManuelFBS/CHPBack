"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_SupAdm_routes_1 = __importDefault(require("./routes/auth-SupAdm.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const articles_routes_1 = __importDefault(require("./routes/articles.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Settings...
app.set('port', process.env.PORT || 8585 || 3000);
// Middlewares...
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes...
app.use('/api/supadm', auth_SupAdm_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/owner', articles_routes_1.default);
app.use('/api/users', users_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map