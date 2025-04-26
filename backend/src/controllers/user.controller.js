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
exports.getUserHandler = void 0;
const http_1 = require("../constants/http");
const user_model_1 = __importDefault(require("../models/user.model"));
const app_Assert_1 = __importDefault(require("../utils/app.Assert"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
exports.getUserHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.userId);
    (0, app_Assert_1.default)(user, http_1.NOT_FOUND, "User not found");
    return res.status(http_1.OK).json(user.omitPassword());
}));
