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
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create a trasporter
    const transport = nodemailer_1.default.createTransport({
        host: 'smtp.mailtrap.io',
        port: 25,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // 2) Define the email options
    const mailOptions = {
        from: 'Dario Leo <dario@test.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    // 3) Actually send the email
    yield transport.sendMail(mailOptions);
});
exports.default = sendEmail;
