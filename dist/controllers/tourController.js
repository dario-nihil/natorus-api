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
exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
const getAllTours = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryObj = Object.assign({}, req.query);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((elm) => delete queryObj[elm]);
    // const { page, sort, limit, fields, ...queryObj} = req.query;
    // This is a more dynamic solution
    // const filteredObj = Object.keys(queryObj)
    //   .filter((query) => !excludedFields.includes(query))
    //   .reduce<{ [x: string]: string | any }>((obj, key) => {
    //     obj[key] = queryObj[key];
    //     return obj;
    //   }, {});
    try {
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = tourModel_1.default.find(JSON.parse(queryStr));
        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else {
            query = query.sort('-createdAt');
        }
        //Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else {
            query = query.select('-__v');
        }
        //Pagiination
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 100);
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const numTours = yield tourModel_1.default.countDocuments();
            if (skip >= numTours)
                throw new Error('This page does not exist');
        }
        const tours = yield query;
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
