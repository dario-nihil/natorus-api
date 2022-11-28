"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tourController_1 = require("../controllers/tourController");
const router = express_1.default.Router();
router.param('id', tourController_1.checkID);
router.route('/').get(tourController_1.getAllTours).post(tourController_1.checkBody, tourController_1.createTour);
router.route('/:id').get(tourController_1.getTour).patch(tourController_1.updateTour).delete(tourController_1.deleteTour);
exports.default = router;
