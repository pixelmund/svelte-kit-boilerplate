<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Check } from '@steeze-ui/heroicons';
	import LoadingSpinner from '$lib/icons/LoadingSpinner.svelte';

	import { onMount } from 'svelte';

	let finished: boolean = false;
	onMount(() => {
		setTimeout(() => {
			finished = true;
			setTimeout(() => {
				window.location.href = '/';
			}, 500);
		}, 1000);
	});
</script>

<h2 class="mb-8 text-xl text-center font-extrabold text-gray-800">Signed in! Redirecting you</h2>
<div class="flex justify-center items-center">
	{#if finished}
		<Icon src={Check} class="w-10 h-10 text-green-400" />
	{:else}
		<LoadingSpinner class="h-10 w-10 text-gray-500" />
	{/if}
</div>
