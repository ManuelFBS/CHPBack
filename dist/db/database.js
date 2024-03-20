"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Article_1 = require("../entities/Article");
const Comment_1 = require("../entities/Comment");
const Schedule_1 = require("../entities/Schedule");
const User_1 = require("../entities/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    entities: [Article_1.Article, Comment_1.Comment, Schedule_1.Schedule, User_1.User],
    logging: false,
    synchronize: true,
});
//# sourceMappingURL=database.js.map