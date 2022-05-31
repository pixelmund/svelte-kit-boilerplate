<script lang="ts">
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
		<svg
			class="w-10 h-10 text-green-400 inline-block"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clip-rule="evenodd"
			/></svg
		>
	{:else}
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
	{/if}
</div>
