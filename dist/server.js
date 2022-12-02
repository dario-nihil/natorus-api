"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    // after an uncaught exception the node process must be killed, because it's into a unclean state
    process.exit(1);
});
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '/vars', 'config.env') });
const app_1 = __importDefault(require("./app"));
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(DB).then(() => console.log('DB connected!'));
const port = process.env.PORT ? +process.env.PORT : 8080;
const server = app_1.default.listen(port, '127.0.0.1', () => {
    console.log('Server app & running....');
    console.log('Listening on port 8080');
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLER REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
