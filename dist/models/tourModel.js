"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const tourSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour must have less or equal then 40 characters'],
        minlength: [10, 'A tour must have more or equal then 40 characters'],
    },
    slug: {
        type: String,
        required: false,
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A group must have aa size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult',
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: (props) => `Discount price ${props.value} should be belowe regular price`,
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Document Middleware: runs before save() and create()
tourSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
// Query Middleware:
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    next();
});
// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
    console.log(this.pipeline());
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});
tourSchema.virtual('durationWeeks').get(function () {
    return +this.duration / 7;
});
exports.default = mongoose_1.default.model('Tour', tourSchema);
