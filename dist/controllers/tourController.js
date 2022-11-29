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
const getAllTours = (req, res) => {
    // res
    //   .status(200)
    //   .json({ status: 'success', data: { tours }, results: tours.length });
};
exports.getAllTours = getAllTours;
const getTour = (req, res) => {
    // const tour = tours.find((tour) => tour.id === +req.params.id);
    // res.status(200).json({ status: 'success', data: { tour } });
};
exports.getTour = getTour;
const createTour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTour = yield tourModel_1.default.create(req.body);
        res.status(200).json({ status: 'success', data: { newTour } });
    }
    catch (err) {
        res.status(400).json({ status: 'fail', message: 'Invalid data sent!' });
    }
});
exports.createTour = createTour;
const updateTour = (req, res) => {
    // const tour = tours.find((tour) => tour.id === +req.params.id);
    // res
    //   .status(200)
    //   .json({ status: 'success', data: { tour: '<Updated tour here...' } });
};
exports.updateTour = updateTour;
const deleteTour = (req, res) => {
    res.status(204).json({ status: 'success', data: null });
};
exports.deleteTour = deleteTour;
