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
exports.resetPasswordHandler = exports.sendPasswordResetHandler = exports.verifyEmailHandler = exports.refreshHandler = exports.logoutHandler = exports.loginHandler = exports.registerHandler = void 0;
const http_1 = require("../constants/http");
const session_model_1 = __importDefault(require("../models/session.model"));
const auth_service_1 = require("../services/auth.service");
const app_Assert_1 = __importDefault(require("../utils/app.Assert"));
const cookies_1 = require("../utils/cookies");
const jwt_1 = require("../utils/jwt");
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const auth_schemas_1 = require("../controllers/auth.schemas");
exports.registerHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schemas_1.registerSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] }));
    const { user, accessToken, refreshToken } = yield (0, auth_service_1.createAccount)(request);
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
        .status(http_1.CREATED)
        .json(user);
}));
exports.loginHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schemas_1.loginSchema.parse(Object.assign(Object.assign({}, req.body), { userAgent: req.headers["user-agent"] }));
    const { accessToken, refreshToken } = yield (0, auth_service_1.loginUser)(request);
    // set cookies
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
        .status(http_1.OK)
        .json({ message: "Login successful" });
}));
exports.logoutHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    const { payload } = (0, jwt_1.verifyToken)(accessToken || "");
    if (payload) {
        // remove session from db
        yield session_model_1.default.findByIdAndDelete(payload.sessionId);
    }
    // clear cookies
    return (0, cookies_1.clearAuthCookies)(res)
        .status(http_1.OK)
        .json({ message: "Logout successful" });
}));
exports.refreshHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    (0, app_Assert_1.default)(refreshToken, http_1.UNAUTHORIZED, "Missing refresh token");
    const { accessToken, newRefreshToken } = yield (0, auth_service_1.refreshUserAccessToken)(refreshToken);
    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, (0, cookies_1.getRefreshTokenCookieOptions)());
    }
    return res
        .status(http_1.OK)
        .cookie("accessToken", accessToken, (0, cookies_1.getAccessTokenCookieOptions)())
        .json({ message: "Access token refreshed" });
}));
exports.verifyEmailHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationCode = auth_schemas_1.verificationCodeSchema.parse(req.params.code);
    yield (0, auth_service_1.verifyEmail)(verificationCode);
    return res.status(http_1.OK).json({ message: "Email was successfully verified" });
}));
exports.sendPasswordResetHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = auth_schemas_1.emailSchema.parse(req.body.email);
    yield (0, auth_service_1.sendPasswordResetEmail)(email);
    return res.status(http_1.OK).json({ message: "Password reset email sent" });
}));
exports.resetPasswordHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = auth_schemas_1.resetPasswordSchema.parse(req.body);
    yield (0, auth_service_1.resetPassword)(request);
    return (0, cookies_1.clearAuthCookies)(res)
        .status(http_1.OK)
        .json({ message: "Password was reset successfully" });
}));
