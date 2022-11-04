import express, { Request, Response, NextFunction, Application } from 'express';
import 'dotenv/config';
import { errorHandler } from './middleware/error';

const bodyParser = require('body-parser');

const app: Application = express();

app.use( (req: Request, res: Response, next: NextFunction) => {
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
        'Access-Control-Allow-Methods': 'POST,PUT,GET,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    next();
} );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import router = require('./urls');

const versionNumber: number = 1;
app.use(`/api/v${versionNumber}/kolohack`, router.router);
app.use(errorHandler);

const PORT: number = process.env.PORT === undefined ? 3000 : +process.env.PORT;

// serve the services
app.listen(
    PORT,
    () => {
        console.log(`'Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    }
);