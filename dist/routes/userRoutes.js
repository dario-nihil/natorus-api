"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.route('/signup').post(authController_1.signup);
router.route('/login').post(authController_1.login);
router.route('/forgotPassword').post(authController_1.forgotPassword);
router.route('/resetPassword/:token').patch(authController_1.resetPassword);
router.route('/updateMyPassword').patch(authController_1.protect, authController_1.updatePassword);
router.route('/updateMe').patch(authController_1.protect, userController_1.updateMe);
router.route('/deleteMe').delete(authController_1.protect, userController_1.deleteMe);
router.route('/').get(userController_1.getAllUsers).post(userController_1.createUser);
router.route('/:id').get(userController_1.getUser).patch(userController_1.updateUser).delete(userController_1.deleteUser);
exports.default = router;
