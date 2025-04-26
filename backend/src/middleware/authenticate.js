"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_Assert_1 = __importDefault(require("../utils/app.Assert"));
const http_1 = require("../constants/http");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    var _a;
    const accessToken = req.cookies.accessToken;
    (0, app_Assert_1.default)(accessToken, http_1.UNAUTHORIZED, "Not authorized", "InvalidAccessToken" /* AppErrorCode.InvalidAccessToken */);
    // 👇 Call verifyToken with the correct payload type
    const result = (0, jwt_1.verifyToken)(accessToken);
    console.log("Token Verification Result:", result);
    (0, app_Assert_1.default)(result.payload, http_1.UNAUTHORIZED, result.error === "jwt expired" ? "Token expired" : "Invalid token", "InvalidAccessToken" /* AppErrorCode.InvalidAccessToken */);
    req.userId = result.payload.userId.toString(); // 👈 cast to string to fix TS
    req.sessionId = (_a = result.payload.sessionId) === null || _a === void 0 ? void 0 : _a.toString(); // optional chaining for safety
    next();
};
exports.default = authenticate;
