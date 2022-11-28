"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = exports.checkID = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tours = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '/dev-data/data/tours-simple.json'), 'utf-8'));
const checkID = (req, res, next) => {
    const tour = tours.find((tour) => tour.id === +req.params.id);
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: `Unable to find tour with id: ${req.params.id}`,
        });
    }
    next();
};
exports.checkID = checkID;
const getAllTours = (req, res) => {
    res
        .status(200)
        .json({ status: 'success', data: { tours }, results: tours.length });
};
exports.getAllTours = getAllTours;
const getTour = (req, res) => {
    const tour = tours.find((tour) => tour.id === +req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
};
exports.getTour = getTour;
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs_1.default.writeFile(path_1.default.join(__dirname, '..', '/dev-data/data/tours-simple.json'), JSON.stringify(tours), (err) => {
        if (err) {
            return res
                .status(500)
                .json({ status: 'error', message: 'Internal Server Error' });
        }
        res.status(201).json({ status: 'success', data: { newTour } });
    });
};
exports.createTour = createTour;
const updateTour = (req, res) => {
    const tour = tours.find((tour) => tour.id === +req.params.id);
    res
        .status(200)
        .json({ status: 'success', data: { tour: '<Updated tour here...' } });
};
exports.updateTour = updateTour;
const deleteTour = (req, res) => {
    res.status(204).json({ status: 'success', data: null });
};
exports.deleteTour = deleteTour;
