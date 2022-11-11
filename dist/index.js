"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const error_1 = require("./middleware/error");
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
        'Access-Control-Allow-Methods': 'POST,PUT,GET,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '200mb' }));
const router = require("./urls");
const versionNumber = 1;
app.use(`/api/v${versionNumber}/kolohack`, router.router);
app.use(error_1.errorHandler);
const PORT = process.env.PORT === undefined ? 3000 : +process.env.PORT;
// serve the services
app.listen(PORT, () => {
    console.log(`'Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
//# sourceMappingURL=index.js.map