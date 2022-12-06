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
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signup = void 0;
const util_1 = require("util");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
const customError_1 = __importDefault(require("../utils/customError"));
const email_1 = __importDefault(require("../utils/email"));
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
        role: req.body.role,
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
    const currenthUser = yield userModel_1.default.findById(decoded.id);
    if (!currenthUser) {
        const error = new customError_1.default('The user belonging to this token no longer exists.');
        error.statusCode = 401;
        return next(error);
    }
    if (currenthUser.changePasswordAfter(decoded.iat)) {
        const error = new customError_1.default('User recently changed password! Please log in again.');
        error.statusCode = 498;
        return next(error);
    }
    req.user = currenthUser;
    next();
}));
const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        const error = new customError_1.default('You do not have permission to perform this action');
        error.statusCode = 403;
        next(error);
    }
    next();
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        const error = new customError_1.default('There is no user with that email address');
        error.statusCode = 404;
        next(error);
    }
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/ressetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forgot your password, please ignore this email!`;
    try {
        yield (0, email_1.default)({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message,
        });
        res
            .status(200)
            .json({ status: 'success', message: 'Token send to email' });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiration = undefined;
        yield user.save({ validateBeforeSave: false });
        const error = new customError_1.default('There was an error sending the email. Try again later!');
        error.statusCode = 500;
        return next(error);
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiration: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        const error = new customError_1.default('Token is invalid or has expired');
        error.statusCode = 400;
        return next(error);
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpiration = undefined;
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    res.status(201).json({ status: 'success', token });
}));
