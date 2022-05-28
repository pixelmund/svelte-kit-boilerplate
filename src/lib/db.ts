import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

export const db = new PrismaClient({
	log: import.meta.env.PROD ? [] : ['info', 'query', 'warn', 'error'],
});
