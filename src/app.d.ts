/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
	VITE_COOKIE_SECRET: string;
	VITE_POSTMARK_FROM_EMAIL: string;
	VITE_POSTMARK_SERVER_API_TOKEN: string;
	VITE_ENABLE_EMAIL_VERIFICATION: string;
	VITE_PUBLIC_URL: string;
}

interface GraphqlContext {
	locals: App.Locals;
	event: import('@sveltejs/kit/types/internal').RequestEvent;
	userId: string;
}

interface CookieSessionData {
	userId: string;
}

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		session: import('svelte-kit-cookie-session').Session<CookieSessionData>;
		cookies: Record<string, string>; // all parsed cookies are automatically set from handleSession to avoid overhead
	}

	// interface Platform {}

	interface Session {
		loggedIn: boolean;
		userId?: string;
	}

	interface Stuff {
		title?: string;
	}
}
