"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', 'config.env') });
const app_1 = __importDefault(require("./app"));
const port = process.env.PORT ? +process.env.PORT : 8080;
app_1.default.listen(port, '127.0.0.1', () => {
    console.log('Server app & running....');
    console.log('Listening on port 8080');
});
