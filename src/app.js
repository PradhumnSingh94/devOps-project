import express, { urlencoded } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from '#config/logger.js';
import authRouter from '#routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.get('/', (req, res) => {
  logger.info('HEllo from app');
  res.status(200).send('hello from app');
});

app.get('/health', (req, res) => {
  res
    .status(200)
    .json({
      status: 'ok',
      timestamp: new Date().toISOString,
      uptime: process.uptime(),
    });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'api is running',
  });
});

app.use('/api/auth', authRouter);

export default app;
