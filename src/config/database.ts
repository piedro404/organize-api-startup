import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

const isDevelopment = process.env.NODE_ENV === 'development';

const prismaConfig = {
  log: isDevelopment 
    ? [
        {
          emit: 'event' as const,
          level: 'query' as const,
        },
        {
          emit: 'event' as const,
          level: 'error' as const,
        },
        {
          emit: 'event' as const,
          level: 'info' as const,
        },
        {
          emit: 'event' as const,
          level: 'warn' as const,
        },
      ]
    : [
        {
          emit: 'event' as const,
          level: 'error' as const,
        },
      ],
};

export const prismaClient = new PrismaClient(prismaConfig);

if (isDevelopment) {
  prismaClient.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Params: ${e.params}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });

  prismaClient.$on('info', (e) => {
    logger.info(`Prisma Info: ${e.message}`);
  });

  prismaClient.$on('warn', (e) => {
    logger.warn(`Prisma Warning: ${e.message}`);
  });

  prismaClient.$on('error', (e) => {
    logger.error(`Prisma Error: ${e.message}`);
  });
}

export const connectDatabase = async () => {
  try {
    await prismaClient.$connect();
    logger.info('🗄️  Database connected successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to database');
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  await prismaClient.$disconnect();
  logger.info('🗄️  Database disconnected');
};

process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});