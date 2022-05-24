<script context="module" lang="ts">
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

<slot />
