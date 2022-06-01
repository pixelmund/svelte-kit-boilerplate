<script lang="ts">
	import { DialogTitle } from '@rgossiaux/svelte-headlessui';

	let klass: string = "";

	export { klass as class };
</script>

<DialogTitle {...$$restProps} class="text-lg leading-6 font-medium text-gray-900 {klass}">
	<slot />
</DialogTitle>
