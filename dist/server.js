"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const port = 8080;
app_1.default.listen(port, '127.0.0.1', () => {
    console.log('Server app & running....');
    console.log('Listening on port 8080');
});
