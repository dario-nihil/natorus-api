"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const customError_1 = __importDefault(require("./utils/customError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
// Global Middleware
// Set Security HTTP headers
app.use((0, helmet_1.default)());
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Limit request from same API
const limiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);
// Body Parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
// Data sanitization aganist NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
// xss-clean doesn't provide d.ts definitions
// Prevent parameter pollution
app.use((0, hpp_1.default)({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
    ],
}));
// Serving Static files
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// Testing Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
app.use('/api/v1/tours', tourRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.all('*', (req, _res, next) => {
    const err = new customError_1.default(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 400;
    next(err);
});
app.use(errorController_1.default);
exports.default = app;
