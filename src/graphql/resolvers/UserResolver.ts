import { db } from '$lib/db';
import { builder } from '../builder';

builder.prismaObject('User', {
	findUnique: (user) => ({ id: user.id }),
	fields: (t) => ({
		id: t.exposeID('id', {}),
		name: t.exposeString('name', {}),
		emailVerified: t.exposeBoolean('emailVerified', {}),
		email: t.string({
			nullable: true,
			resolve: async (user, _args, { userId, locals }) => {
				const sessionUserId = userId || (await locals.session.data())?.userId;
				if (!sessionUserId) return null;
				if (user.id !== sessionUserId) return null;
				return user.email;
			}
		}),
		notes: t.relatedConnection('notes', {
			cursor: 'id',
			query: () => ({ orderBy: { createdAt: 'desc' } })
		})
	})
});

const EditUserInput = builder.inputType('EditUserInput', {
	fields: (t) => ({
		name: t.string({
			required: false,
			validate: {
				minLength: 1,
				maxLength: 100
			}
		})
	})
});

builder.mutationField('editUser', (t) =>
	t.prismaField({
		type: 'User',
		args: {
			input: t.arg({ type: EditUserInput })
		},
		resolve: (query, _root, { input }, { userId }) => {
			return db.user.update({
				...query,
				where: {
					id: userId
				},
				data: {
					// NOTE: Because `name` may be `null`, we use `?? undefined` to ensure that
					// it is either a value, or undefined.
					// https://www.prisma.io/docs/concepts/components/prisma-client/null-and-undefined
					name: input.name ?? undefined
				}
			});
		}
	})
);
