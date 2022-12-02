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
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const customError_1 = __importDefault(require("../utils/customError"));
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = new customError_1.default('Please provide email and password');
        error.statusCode = 400;
        return next(error);
    }
    const user = yield userModel_1.default.findOne({ email }).select('+password');
    if (!user ||
        !(yield user.correctPassword(password, user.password))) {
        const error = new customError_1.default('Incorrect email or password');
        error.statusCode = 401;
        return next(error);
    }
    const token = signToken(user._id);
    res.status(200).json({ status: 'success', token });
}));
