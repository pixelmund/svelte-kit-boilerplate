<script lang="ts">
	import LoadingSpinner from '$lib/icons/LoadingSpinner.svelte';
	import Button from './Button.svelte';
	import type { ButtonSize, ButtonVariant } from './types';

	export let variant: ButtonVariant = 'primary';
	export let size: ButtonSize = 'medium';
	export let full: boolean = false;
	export let isSubmitting: boolean = false;

	let klass: string = '';

	export { klass as class };
</script>

<Button class={klass} {variant} {size} type="submit" {full} {...$$restProps}>
	{#if isSubmitting}
		<LoadingSpinner class="-ml-1 mr-3 h-5 w-5 text-white" />
	{/if}
	<slot />
</Button>
