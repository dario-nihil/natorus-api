"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This construct allows to reduce the amount of work inside the action controller (now not handle the error on its own)
// and concentrate onthe work it's supposed to do
exports.default = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
