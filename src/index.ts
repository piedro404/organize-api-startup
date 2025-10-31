import express from 'express';

import { PORT } from './config/index.js'; 
import { setupServer } from './config/server.js';

import appRouter from './routes/app.route.js';
import { connectDatabase } from '@config/database.js';
import { logger } from '@config/logger.js';
import { HTTP_STATUS } from './utils/constants.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app: express.Application = express();

setupServer(app);

app.use(appRouter);

app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({ status: false, message: 'Not Found' });
});

app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
      logger.info(`📚 Documentation available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();