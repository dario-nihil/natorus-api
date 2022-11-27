"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const tours = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '/dev-data/data/tours-simple.json'), 'utf-8'));
app.get('/api/v1/tours', (req, res) => {
    res
        .status(200)
        .json({ status: 'success', data: { tours }, results: tours.length });
});
app.listen(8080, '127.0.0.1', () => {
    console.log('Server app & running....');
    console.log('Listening on port 8080');
});
