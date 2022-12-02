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
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getAllUsers = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("../models/userModel"));
exports.getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find();
    res
        .status(200)
        .json({ status: 'success', data: { users }, results: users.length });
}));
const createUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'This route is not yet defined!' });
};
exports.createUser = createUser;
const getUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'This route is not yet defined!' });
};
exports.getUser = getUser;
const updateUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'This route is not yet defined!' });
};
exports.updateUser = updateUser;
const deleteUser = (req, res) => {
    res
        .status(500)
        .json({ status: 'error', message: 'This route is not yet defined!' });
};
exports.deleteUser = deleteUser;
