<script lang="ts">
	import type { Writable } from 'svelte/store';

	type FormAction = (node: HTMLFormElement) => {
		destroy: () => void;
	};
	export let form: FormAction;
	export let containerClass: string = '';
	export let isSubmitting: Writable<boolean>;
	export let method: 'POST' | 'GET' = 'POST';

	let klass: string = '';

	export { klass as class };
</script>

<form use:form {method} class="w-full block {containerClass}" {...$$restProps}>
	<fieldset class="w-full {klass}" disabled={$isSubmitting}>
		<slot />
	</fieldset>
</form>
