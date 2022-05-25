import crypto from 'crypto';
import { bcrypt, bcryptVerify } from 'hash-wasm';
import { db } from './db';
import { ValidationError } from '../graphql/errors';

/**
 * This is the cost factor of the bcrypt hash function. In general, this number
 * should be changed as CPUs get faster.
 */
const COST_FACTOR = 11;

/**
 * Hash a plain text password and return the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.randomBytes(16);

	const key = await bcrypt({
		password,
		salt,
		costFactor: COST_FACTOR,
		outputType: 'encoded'
	});

	return key;
}

/**
 * Verify that a hashed password and a plain text password match.
 */
export function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
	return bcryptVerify({
		password,
		hash: hashedPassword
	});
}

/**
 * Attempts to authenticate a user, given their username and password.
 */
export async function authenticateUser(email: string, password: string) {
	const user = await db.user.findFirst({
		where: {
			email: {
				equals: email
			}
		}
	});

	if (!user || !user.hashedPassword) {
		throw new ValidationError('Email not found', {
			email: 'Email not found.'
		});
	}

	// If the password is invalid, reject the authenticate request:
	if (!(await verifyPassword(user.hashedPassword, password))) {
		throw new ValidationError('Invalid password.', {
			password: 'Password is incorrect.'
		});
	}

	// Hash should be in the form of $2b$costFactor$hash
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [, _algo, costFactorString] = user.hashedPassword.split('$');

	// NOTE: This never practically should happen, but we want to error out in the event that it does:
	if (!costFactorString) {
		throw new Error('Unknown password format.');
	}

	// If the password was hashed with a work factor that is not the same as the current work factor,
	// we will seamlessly upgrade it to the updated work factor:
	const costFactor = parseInt(costFactorString, 10);
	if (costFactor !== COST_FACTOR) {
		const improvedHash = await hashPassword(password);
		await db.user.update({
			where: { id: user.id },
			data: { hashedPassword: improvedHash }
		});
	}

	// When you successfully sign-in, we consider any password resets that you've
	// created to be invalid, so we clear them from the database:
	await db.passwordReset.deleteMany({
		where: {
			userId: user.id
		}
	});

	return user;
}
