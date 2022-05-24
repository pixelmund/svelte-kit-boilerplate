<script lang="ts">
	import { onDestroy } from 'svelte';

	export let messages: string[] | null;
	export let name: string;
	export let hasError: boolean = false;

	$: console.log(messages);

	$: if (messages && messages.length > 0) {
		hasError = true;
	} else if (hasError) {
		hasError = false;
	}

	onDestroy(() => {
		hasError = false;
	});
</script>

<p class="mt-2 text-sm text-red-600" id="{name}-error">{messages ? messages[0] : ''}</p>
