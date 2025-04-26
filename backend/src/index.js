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
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authenticate_1 = __importDefault(require("./middleware/authenticate"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const session_route_1 = __importDefault(require("./routes/session.route"));
const env_1 = require("./constants/env");
const db = require('./config/db');
const app = (0, express_1.default)();
// add middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
// health check
app.get("/", (req, res) => {
    return res.status(200).json({
        status: "healthy",
    });
});
// auth routes
app.use("/auth", auth_route_1.default);
// protected routes
app.use("/user", authenticate_1.default, user_route_1.default);
app.use("/sessions", authenticate_1.default, session_route_1.default);
// error handler
app.use(errorHandler_1.default);
app.listen(env_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server listening on port ${env_1.PORT} in ${env_1.NODE_ENV} environment`);
    yield (0, db_1.default)();
}));
