import express, { Application } from 'express';
import cors from 'cors';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { corsOptions } from './cors.js';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const upload = multer();

export function setupServer(app: Application) {
  app.use(cors(corsOptions));
  app.use(upload.any());
  app.use(express.static(join(__dirname, '../static')));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
}
