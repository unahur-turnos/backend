import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import passport from 'passport';
import routes from './routes';
import { onlyOnProduction } from './config/env';
import { rollbar } from './config/rollbar';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(passport.initialize());
app.use(passport.session());

onlyOnProduction(() => app.use(rollbar.errorHandler()));

app.use('/', routes);

module.exports = app;
