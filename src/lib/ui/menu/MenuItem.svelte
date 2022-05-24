<script lang="ts">
	import { MenuItem } from '@rgossiaux/svelte-headlessui';

	let klass: string = "";
	export let href: string;

	export { klass as class };
</script>

<MenuItem let:active {...$$restProps}>
	<a class="block px-4 py-2 text-sm text-gray-700 {active ? 'bg-gray-100' : ''} {klass}" {href}>
		<slot />
	</a>
</MenuItem>
