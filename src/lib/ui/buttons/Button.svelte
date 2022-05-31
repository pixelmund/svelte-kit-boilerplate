<script lang="ts">
	import { BUTTON_SIZE_CLASSES, BUTTON_VARIANT_CLASSES } from './types';
	import type { ButtonVariant, ButtonSize } from './types';

	export let variant: ButtonVariant = 'primary';
	export let size: ButtonSize = 'medium';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let full: boolean = false;

	let klass: string = '';

	export { klass as class };
</script>

<button
	on:click
	{...$$restProps}
	{type}
	class="inline-flex items-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 {BUTTON_SIZE_CLASSES[
		size
	]} {BUTTON_VARIANT_CLASSES[variant]} {klass} {full ? 'w-full text-center justify-center' : ''}"
>
	<slot />
</button>
