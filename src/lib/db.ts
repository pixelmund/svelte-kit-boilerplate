import { dev } from '$app/env';
import Prisma from '@prisma/client';
const { PrismaClient } = Prisma;

export const db = new PrismaClient({
	log: !dev ? [] : ['info', 'query', 'warn', 'error'],
});
