import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import colors from 'colors';
import findConfig from 'find-config';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import {
  visitMiddleware,
  incrementCountMiddleware,
} from './middleware/visitMiddleware.js';
import visitRoutes from './routes/visitRoutes.js';
import userRoutes from './routes/userRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import logger from './controllers/logger.js';
import https from 'https';
import fs from 'fs';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: findConfig('.env.dev') });
}

connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Use middleware to increment visitor count
app.use(visitMiddleware);
app.use(incrementCountMiddleware);

app.use('/api/visits', visitRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/diseases', diseaseRoutes);

const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/FrontEnd/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'FrontEnd', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

let PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  // app.listen(PORT, () => {
  //   logger.info(`Server is running on port: ${PORT}`.yellow.bold);
  // });

  https
    .createServer(
      {
        key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
        cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.cert')),
      },
      app
    )
    .listen(PORT, () => {
      logger.info(`AGROHELP SERVER STARTED!`.yellow.bold);
      logger.info(`HTTPS Server is listening on port: ${PORT}`.yellow.bold);
    });
}

export default app;
