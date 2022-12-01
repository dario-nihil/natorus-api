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
exports.getMonthlyPlan = exports.getTourStats = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = exports.aliasTopTours = void 0;
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const customError_1 = __importDefault(require("../utils/customError"));
const aliasTopTours = (req, _res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
exports.aliasTopTours = aliasTopTours;
exports.getAllTours = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const features = new apiFeatures_1.default(tourModel_1.default.find(), req)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = yield features.query;
    res
        .status(200)
        .json({ status: 'success', data: { tours }, results: tours.length });
}));
exports.getTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tourModel_1.default.findById(req.params.id);
    if (!tour) {
        const error = new customError_1.default('No tour found with that ID');
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json({ status: 'success', data: { tour } });
}));
exports.createTour = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const newTour = yield tourModel_1.default.create(req.body);
    res.status(201).json({ status: 'success', data: { newTour } });
}));
exports.updateTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tourModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        const error = new customError_1.default('No tour found with that ID');
        error.statusCode = 404;
        return next(error);
    }
    res.status(200).json({ status: 'success', data: { tour } });
}));
exports.deleteTour = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tour = yield tourModel_1.default.findByIdAndDelete(req.params.id);
    if (!tour) {
        const error = new customError_1.default('No tour found with that ID');
        error.statusCode = 404;
        return next(error);
    }
    res.status(204).json({ status: 'success' });
}));
exports.getTourStats = (0, catchAsync_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield tourModel_1.default.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
    ]);
    res.status(200).json({ status: 'success', data: { stats } });
}));
exports.getMonthlyPlan = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const year = +req.params.year;
    const plan = yield tourModel_1.default.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
    ]);
    res.status(200).json({ status: 'success', data: { plan } });
}));
