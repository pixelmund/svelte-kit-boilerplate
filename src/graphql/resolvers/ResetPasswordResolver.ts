import { addDays } from 'date-fns';
import { hashPassword } from '$lib/auth';
import { db } from '$lib/db';
import { builder } from '../builder';
import { Result } from './ResultResolver';

const ForgotPasswordInput = builder.inputType('ForgotPasswordInput', {
	fields: (t) => ({
		email: t.string({ validate: { email: true } })
	})
});

builder.mutationField('forgotPassword', (t) =>
	t.field({
		type: Result,
		skipTypeScopes: true,
		authScopes: {
			unauthenticated: true
		},
		args: {
			input: t.arg({ type: ForgotPasswordInput })
		},
		resolve: async (_parent, { input }) => {
			const user = await db.user.findFirst({
				where: {
					email: input.email
				},
				rejectOnNotFound: true
			});

			// Avoid an email verification bypass where a user can sign-up,
			// reset their password, and then create a session by finishing
			// the sign-in through the reset password flow:
			// if (ENABLE_EMAIL_VERIFICATION && !user.emailVerified) {
			// 	throw new Error(
			// 		'You cannot reset your password until the email address is verified.',
			// 	);
			// }

			const reset = await db.passwordReset.create({
				data: {
					userId: user.id,
					// Password resets expire in 1 days if not used:
					expiresAt: addDays(new Date(), 1)
				}
			});

			console.log('RESET_ID:', reset.id);

			// await sendEmail({
			// 	to: user.email,
			// 	subject: 'Nytro: Reset your password',
			// 	textBody: `We received a request to reset your Nytro account password. To reset your password, follow this link: ${PUBLIC_URL}/auth/reset?code=${reset.id}. If you did not request this, you can ignore this email.`,
			// });

			return Result.SUCCESS;
		}
	})
);

const ResetPasswordInput = builder.inputType('ResetPasswordInput', {
	fields: (t) => ({
		code: t.string(),
		newPassword: t.string({ validate: { minLength: 6 } })
	})
});

builder.mutationField('resetPassword', (t) =>
	t.field({
		type: Result,
		skipTypeScopes: true,
		authScopes: {
			unauthenticated: true
		},
		args: {
			input: t.arg({ type: ResetPasswordInput })
		},
		resolve: async (_parent, { input }, { locals }) => {
			const reset = await db.passwordReset.findFirst({
				where: {
					id: input.code
				},
				rejectOnNotFound: true
			});

			if (new Date() > reset.expiresAt) {
				throw new Error('Password reset is expired.');
			}

			const user = await db.user.update({
				where: {
					id: reset.userId
				},
				data: {
					hashedPassword: await hashPassword(input.newPassword)
				}
			});

			// When you successfully reset your password, we consider any password resets that you've
			// created to be invalid, so we clear them from the database:
			await db.passwordReset.deleteMany({
				where: {
					userId: user.id
				}
			});

			await locals.session.data({ userId: user.id });

			return Result.SUCCESS;
		}
	})
);
