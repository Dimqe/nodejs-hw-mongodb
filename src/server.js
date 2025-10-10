// src/server.js

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
// Імпортуємо нові обробники помилок
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  // Middleware для парсингу JSON-тіла запитів (необхідно для POST, PATCH)
  app.use(express.json());

  // Інші загальні мідлвари
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Підключаємо роутер
  app.use(contactsRouter);

  // Обробник для неіснуючих роутів (404). Має бути після роутерів.
  app.use(notFoundHandler);

  // Глобальний обробник помилок. Має бути останнім app.use().
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};