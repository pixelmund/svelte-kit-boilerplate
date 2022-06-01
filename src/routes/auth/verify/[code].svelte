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
	import { Result } from '$lib/utils/result';
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/icons/LoadingSpinner.svelte';

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
		<LoadingSpinner class="h-10 w-10 text-gray-500" />
	{:else}
		<h5 class="text-lg text-red-500">{errorMessage}</h5>
	{/if}
</div>
