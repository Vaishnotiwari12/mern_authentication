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
exports.deleteSessionHandler = exports.getSessionsHandler = void 0;
const zod_1 = require("zod");
const http_1 = require("../constants/http");
const session_model_1 = __importDefault(require("../models/session.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const app_Assert_1 = __importDefault(require("../utils/app.Assert"));
exports.getSessionsHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield session_model_1.default.find({
        userId: req.userId,
        expiresAt: { $gt: Date.now() },
    }, {
        _id: 1,
        userAgent: 1,
        createdAt: 1,
    }, {
        sort: { createdAt: -1 },
    });
    return res.status(http_1.OK).json(
    // mark the current session
    sessions.map((session) => (Object.assign(Object.assign({}, session.toObject()), (session.id === req.sessionId && {
        isCurrent: true,
    })))));
}));
exports.deleteSessionHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = zod_1.z.string().parse(req.params.id);
    const deleted = yield session_model_1.default.findOneAndDelete({
        _id: sessionId,
        userId: req.userId,
    });
    (0, app_Assert_1.default)(deleted, http_1.NOT_FOUND, "Session not found");
    return res.status(http_1.OK).json({ message: "Session removed" });
}));
