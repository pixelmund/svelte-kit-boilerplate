<script context="module" lang="ts">
	import { page } from '$app/stores';
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

<h2 class="mb-8 text-3xl text-center font-extrabold text-gray-800">{$page.stuff?.title}</h2>
<slot />
