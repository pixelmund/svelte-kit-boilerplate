import type { GetSession } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleSession } from 'svelte-kit-cookie-session';

export const getSession: GetSession = async ({ locals }) => {
	const sessionData = await locals.session.data();

	if (!sessionData) {
		return {
			loggedIn: false
		};
	}

	return {
		loggedIn: true,
		userId: sessionData.userId
	};
};

export const handle = sequence(
	handleSession({ secret: [{ id: 1, secret: import.meta.env.VITE_COOKIE_SECRET }] }),
	async ({ resolve, event }) => {
		await event.locals.session.data();
		const result = resolve(event);
		return result;
	}
);
