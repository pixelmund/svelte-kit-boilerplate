import { db } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function main() {
	await db.$connect();

	await db.user.upsert({
		where: { email: 'admin@skytro.dev' },
		create: {
			name: 'Admin',
			email: 'admin@skytro.dev',
			hashedPassword: await hashPassword('bf1234')
		},
		update: {}
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
