// src/server.js
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';

export const setupServer = () => {
  const app = express();

  // Налаштування логгера
  app.use(pino({
    transport: {
      target: 'pino-pretty',
    },
  }));

  // Налаштування CORS
  app.use(cors());

  // 👉 FIX 1: Підключаємо роутер, щоб маршрути /contacts працювали
  app.use(contactsRouter);

  // 👉 FIX 2: Обробка неіснуючих роутів (404) з правильним синтаксисом
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};