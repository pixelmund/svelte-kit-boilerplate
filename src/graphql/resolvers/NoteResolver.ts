import { builder } from '$graphql/builder';
import { db } from '$lib/db';

builder.prismaNode('Note', {
	findUnique: (id) => ({ id }),
	id: { resolve: (note) => note.id },
	fields: (t) => ({
		text: t.exposeString('text'),
		user: t.relation('user'),
		createdAt: t.expose('createdAt', { type: 'DateTime' })
	})
});

builder.queryField('notes', (t) =>
	t.prismaConnection({
		type: 'Note',
		cursor: 'id',
		resolve: (query, _root, _args, { userId }) => {
			return db.note.findMany({
				...query,
				where: {
					userId
				}
			});
		}
	})
);

builder.queryField('note', (t) =>
	t.prismaField({
		type: 'Note',
		args: {
			id: t.arg.globalID({})
		},
		resolve: (query, _root, { id: { id } }, { userId }) => {
			return db.note.findFirst({
				...query,
				where: {
					id,
					userId
				},
				rejectOnNotFound: true
			});
		}
	})
);

const CreateNoteInput = builder.inputType('CreateNoteInput', {
	fields: (t) => ({
		text: t.string({ validate: { minLength: 1 } })
	})
});

builder.mutationField('createNote', (t) =>
	t.prismaField({
		type: 'Note',
		args: {
			input: t.arg({ type: CreateNoteInput })
		},
		resolve: (query, _root, { input }, { userId }) => {
			return db.note.create({
				...query,
				data: {
					userId,
					text: input.text
				}
			});
		}
	})
);

const EditNoteInput = builder.inputType('EditNoteInput', {
	fields: (t) => ({
		id: t.globalID({}),
		text: t.string({})
	})
});

builder.mutationField('editNote', (t) =>
	t.prismaField({
		type: 'Note',
		args: {
			input: t.arg({ type: EditNoteInput })
		},
		resolve: async (query, _root, { input }, { userId }) => {
			const note = await db.note.findFirst({
				where: {
					id: input.id.id,
					// NOTE: We add the user ID here to ensure that users can only
					// edit their own notes.
					userId
				},

				// Just reject if the record is not found:
				rejectOnNotFound: true
			});

			return db.note.update({
				...query,
				where: { id: note.id },
				data: { text: input.text }
			});
		}
	})
);

const DeleteNoteInput = builder.inputType('DeleteNoteInput', {
	fields: (t) => ({
		id: t.globalID({})
	})
});

builder.mutationField('deleteNote', (t) =>
	t.prismaField({
		type: 'Note',
		args: {
			input: t.arg({ type: DeleteNoteInput })
		},
		resolve: async (query, _root, { input }, { userId }) => {
			const note = await db.note.findFirst({
				where: {
					id: input.id.id,
					// NOTE: We add the user ID here to ensure that users can only
					// edit their own notes.
					userId
				},

				// Just reject if the record is not found:
				rejectOnNotFound: true
			});

			return db.note.delete({
				...query,
				where: { id: note.id }
			});
		}
	})
);
