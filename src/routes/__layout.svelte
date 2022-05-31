<script context="module" lang="ts">
	import env from '../environment';
	import { setEnvironment } from '$houdini';

	setEnvironment(env);
</script>

<script lang="ts">
	import '../app.css';
	import AppLayout from '$lib/ui/layouts/AppLayout.svelte';
</script>

<AppLayout>
	<slot />
</AppLayout>
