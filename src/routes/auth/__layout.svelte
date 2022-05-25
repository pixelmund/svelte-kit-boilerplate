<script context="module" lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/Logo.svelte';

	import type { LoadEvent, LoadOutput } from '@sveltejs/kit';

	export const load = ({ session }: LoadEvent): LoadOutput => {
		if (session.loggedIn) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		return {};
	};
</script>

<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<Logo />
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<h2 class="mb-8 text-3xl text-center font-extrabold text-gray-800">{$page.stuff?.title}</h2>
			<slot />
		</div>
	</div>
</div>
