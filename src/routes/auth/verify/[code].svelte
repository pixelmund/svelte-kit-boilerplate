<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Verifying your e-mail'
			}
		};
	};
</script>

<script lang="ts">
	import { graphql, mutation } from '$houdini';
	import type { VerifyEmail } from '$houdini';
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { Result } from '$lib/result';
	import { goto } from '$app/navigation';

	const verifyEmail = mutation<VerifyEmail>(graphql`
		mutation VerifyEmail($input: VerifyEmailInput!) {
			verifyEmail(input: $input)
		}
	`);

	let isVerifying = true;
	let errorMessage = '';

	onMount(async () => {
		try {
			const result = await verifyEmail({ input: { code: $page.params.code } });
			isVerifying = false;
			if (result?.verifyEmail === Result.SUCCESS) {
				await goto('/auth-redirect');
				await tick();
				return;
			}
			errorMessage = 'Invalid verification code';
		} catch (error) {
			isVerifying = false;
			// @ts-ignore
			errorMessage = error?.[0].message;
		}
	});
</script>

<div class="flex justify-center items-center">
	{#if isVerifying}
		<svg
			class="animate-spin h-10 w-10 text-gray-500"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{:else}
		<h5 class="text-lg text-red-500">{errorMessage}</h5>
	{/if}
</div>
