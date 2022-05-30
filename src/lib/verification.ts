import type { User } from '@prisma/client';
import { sendEmail } from './email';
import { db } from './db';

export const ENABLE_EMAIL_VERIFICATION = import.meta.env.VITE_ENABLE_EMAIL_VERIFICATION === 'true';
export const PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL || '';

if (!PUBLIC_URL) {
	console.warn(
		'No `VITE_PUBLIC_URL` environment variable was set. This can cause production errors.'
	);
}

export async function sendVerificationEmail(user: User) {
	const code = Buffer.from(user.verificationCode).toString('base64url');

	await sendEmail({
		to: user.email,
		subject: 'Skytro: Confirm your email',
		textBody: `You need to verify your email to finish signing up for Skytro. Click this link to continue: ${PUBLIC_URL}/auth/verify/${code}`
	});
}

export async function verifyEmailToken(token: string) {
	const verificationCode = Buffer.from(token, 'base64url').toString('utf8');

	const user = await db.user.findFirst({
		where: {
			verificationCode
		},
		rejectOnNotFound: true
	});

	if (user.emailVerified) {
		throw new Error('Email has already been verified.');
	}

	return await db.user.update({
		where: { id: user.id },
		data: {
			emailVerified: true
		}
	});
}
