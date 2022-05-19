import { sequence } from '@sveltejs/kit/hooks';
import { handleSession } from 'svelte-kit-cookie-session';

export const handle = sequence(
	handleSession({ secret: [{ id: 1, secret: import.meta.env.VITE_COOKIE_SECRET }] }),
	({ resolve, event }) => {
		const result = resolve(event);
		return result;
	}
);
