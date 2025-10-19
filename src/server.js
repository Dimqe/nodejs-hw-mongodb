
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js'; 
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs'; // <-- ДОДАЙТЕ ЦЕЙ ІМПОРТ
import path from 'node:path';

const swaggerFilePath = path.resolve('docs', 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf-8'));

export const setupServer = () => {
  const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser()); 

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );


  app.use('/auth', authRouter); 
  app.use(contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};