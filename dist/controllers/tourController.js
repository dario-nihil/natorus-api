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
exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = exports.aliasTopTours = void 0;
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
const aliasTopTours = (req, _res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
exports.aliasTopTours = aliasTopTours;
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const features = new apiFeatures_1.default(tourModel_1.default.find(), req)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = yield features.query;
        res
            .status(200)
            .json({ status: 'success', data: { tours }, results: tours.length });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: err });
    }
});
exports.getAllTours = getAllTours;
const getTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModel_1.default.findById(req.params.id);
        res.status(200).json({ status: 'success', data: { tour } });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: err });
    }
});
exports.getTour = getTour;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield tourModel_1.default.create(req.body);
        res.status(201).json({ status: 'success', data: { newTour } });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: err });
    }
});
exports.createTour = createTour;
const updateTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tour = yield tourModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ status: 'success', data: { tour } });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: err });
    }
});
exports.updateTour = updateTour;
const deleteTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield tourModel_1.default.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success' });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: err });
    }
});
exports.deleteTour = deleteTour;
