<script context="module" lang="ts">
	import houdiniClient from '../environment';
	houdiniClient.init();
</script>

<script lang="ts">
	import '../app.css';
	import AppLayout from '$lib/ui/layouts/AppLayout.svelte';
</script>

<AppLayout>
	<slot />
</AppLayout>
