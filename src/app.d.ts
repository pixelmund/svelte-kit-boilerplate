/// <reference types="@sveltejs/kit" />

interface ImportMetaEnv {
	VITE_COOKIE_SECRET: string;
}

interface GraphqlContext {
	locals: App.Locals;
	event: import('@sveltejs/kit/types/internal').RequestEvent;
	userId: string;
}

interface CookieSessionData {
	userId: string;
}

type FormSubmitEvent = SubmitEvent & {
	currentTarget: EventTarget & HTMLFormElement;
};

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

	// interface Stuff {}
}
