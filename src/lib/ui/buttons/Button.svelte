<script lang="ts">
	import type { ButtonSize, ButtonVariant } from './types';

	export let variant: ButtonVariant = 'primary';
	export let size: ButtonSize = 'medium';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let full: boolean = false;

	let klass: string = '';

	const BUTTON_SIZE_CLASSES = {
		small: 'px-3 py-2 leading-4 text-sm',
		medium: 'px-4 py-2 text-sm',
		large: 'px-4 py-2 text-base'
	};

	const BUTTON_VARIANT_CLASSES = {
		primary:
			'border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
		secondary:
			'border border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500',
		ghost:
			'border border-gray-300 text-indigo-700 bg-transparent hover:text-indigo-800 focus:ring-indigo-500'
	};

	export { klass as class };
</script>

<button
	{...$$restProps}
	{type}
	class="inline-flex items-center font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 {BUTTON_SIZE_CLASSES[
		size
	]} {BUTTON_VARIANT_CLASSES[variant]} {klass} {full ? 'w-full text-center justify-center' : ''}"
>
	<slot />
</button>
