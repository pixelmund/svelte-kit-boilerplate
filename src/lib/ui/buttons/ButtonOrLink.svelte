<script lang="ts">
	import { BUTTON_SIZE_CLASSES, BUTTON_VARIANT_CLASSES } from './types';
	import type { ButtonVariant, ButtonSize } from './types';

	export let variant: ButtonVariant = 'primary';
	export let size: ButtonSize = 'medium';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let full: boolean = false;
	export let href: string = '';

	let klass: string = '';

	export { klass as class };
</script>

{#if href && href.length > 0}
	<a
		{href}
		{...$$restProps}
		class="inline-flex items-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 {BUTTON_SIZE_CLASSES[
			size
		]} {BUTTON_VARIANT_CLASSES[variant]} {klass} {full ? 'w-full text-center justify-center' : ''}"
	>
		<slot />
	</a>
{:else}
	<button
		on:click
		{...$$restProps}
		{type}
		class="inline-flex items-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 {BUTTON_SIZE_CLASSES[
			size
		]} {BUTTON_VARIANT_CLASSES[variant]} {klass} {full ? 'w-full text-center justify-center' : ''}"
	>
		<slot />
	</button>
{/if}
