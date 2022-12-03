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
exports.protect = exports.login = exports.signup = void 0;
const util_1 = require("util");
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
        passwordChangedAt: req.body.passwordChangedAt,
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
    const error = new Error();
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
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = undefined;
    if (req.headers.authorization ||
        ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer'))) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        const error = new customError_1.default('You are not logged in! Please log in to get access.');
        error.statusCode = 401;
        return next(error);
    }
    const decoded = yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET);
    const freshUser = yield userModel_1.default.findById(decoded.id);
    if (!freshUser) {
        const error = new customError_1.default('The user belonging to this token no longer exists.');
        error.statusCode = 401;
        return next(error);
    }
    if (freshUser.changePasswordAfter(decoded.iat)) {
        const error = new customError_1.default('User recently changed password! Please log in again.');
        error.statusCode = 498;
        return next(error);
    }
    req.user = freshUser;
    next();
}));
